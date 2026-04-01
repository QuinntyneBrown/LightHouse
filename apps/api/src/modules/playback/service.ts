import type { PrismaClient } from "@prisma/client";
import * as Minio from "minio";
import { NotFoundError } from "../../utils/errors.js";
import { parsePagination, paginatedResponse } from "../../utils/pagination.js";
import type { ProgressUpdateInput, HistoryQueryInput } from "./schema.js";

export class PlaybackService {
  private minioClient: Minio.Client;
  private bucket: string;

  constructor(
    private prisma: PrismaClient,
    minioConfig: {
      endPoint: string;
      port: number;
      accessKey: string;
      secretKey: string;
      useSSL: boolean;
      bucket: string;
    }
  ) {
    this.minioClient = new Minio.Client({
      endPoint: minioConfig.endPoint,
      port: minioConfig.port,
      accessKey: minioConfig.accessKey,
      secretKey: minioConfig.secretKey,
      useSSL: minioConfig.useSSL,
    });
    this.bucket = minioConfig.bucket;
  }

  async getStreamUrl(contentId: string, profileId: string) {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
    });
    if (!content) throw new NotFoundError("Content", contentId);

    // Get media assets with variants
    const assets = await this.prisma.mediaAsset.findMany({
      where: { contentId },
      include: { variants: true },
    });

    const variants: Array<{
      url: string;
      format: string;
      resolution: string | null;
      bitrateKbps: number | null;
    }> = [];

    // Generate presigned URLs for each variant
    for (const asset of assets) {
      for (const variant of asset.variants) {
        try {
          const url = await this.minioClient.presignedGetObject(
            this.bucket,
            variant.variantKey,
            3600 // 1 hour
          );
          variants.push({
            url,
            format: variant.format,
            resolution: variant.resolution,
            bitrateKbps: variant.bitrateKbps,
          });
        } catch {
          // Skip variants that can't generate URLs
        }
      }
    }

    // If no variants, try original asset
    let primaryUrl = "";
    if (assets.length > 0) {
      try {
        primaryUrl = await this.minioClient.presignedGetObject(
          this.bucket,
          assets[0].originalKey,
          3600
        );
      } catch {
        primaryUrl = "";
      }
    }

    // Record playback session
    await this.prisma.playbackSession.create({
      data: {
        childProfileId: profileId,
        contentId,
      },
    });

    return {
      url: primaryUrl,
      expiresIn: 3600,
      contentId,
      contentType: content.contentType,
      variants,
    };
  }

  async saveProgress(profileId: string, input: ProgressUpdateInput) {
    const progress = await this.prisma.watchProgress.upsert({
      where: {
        childProfileId_contentId: {
          childProfileId: profileId,
          contentId: input.contentId,
        },
      },
      create: {
        childProfileId: profileId,
        contentId: input.contentId,
        progressSeconds: input.progressSeconds,
        completed: input.completed,
      },
      update: {
        progressSeconds: input.progressSeconds,
        completed: input.completed,
      },
    });

    // Update playback session duration
    const activeSession = await this.prisma.playbackSession.findFirst({
      where: {
        childProfileId: profileId,
        contentId: input.contentId,
        endedAt: null,
      },
      orderBy: { startedAt: "desc" },
    });

    if (activeSession) {
      const duration = Math.floor(
        (Date.now() - activeSession.startedAt.getTime()) / 1000
      );

      if (input.completed) {
        await this.prisma.playbackSession.update({
          where: { id: activeSession.id },
          data: {
            endedAt: new Date(),
            durationSeconds: duration,
          },
        });
      } else {
        await this.prisma.playbackSession.update({
          where: { id: activeSession.id },
          data: { durationSeconds: duration },
        });
      }
    }

    // Record in view history if completed
    if (input.completed) {
      await this.prisma.viewHistoryEntry.create({
        data: {
          childProfileId: profileId,
          contentId: input.contentId,
          durationSeconds: input.progressSeconds,
        },
      });
    }

    return {
      contentId: progress.contentId,
      progressSeconds: progress.progressSeconds,
      completed: progress.completed,
      updatedAt: progress.updatedAt.toISOString(),
    };
  }

  async getProgress(profileId: string, contentId: string) {
    const progress = await this.prisma.watchProgress.findUnique({
      where: {
        childProfileId_contentId: {
          childProfileId: profileId,
          contentId,
        },
      },
    });

    if (!progress) {
      return {
        contentId,
        progressSeconds: 0,
        completed: false,
        updatedAt: new Date().toISOString(),
      };
    }

    return {
      contentId: progress.contentId,
      progressSeconds: progress.progressSeconds,
      completed: progress.completed,
      updatedAt: progress.updatedAt.toISOString(),
    };
  }

  async getHistory(input: HistoryQueryInput) {
    const { offset, limit } = parsePagination(input);

    const [items, total] = await Promise.all([
      this.prisma.playbackSession.findMany({
        where: { childProfileId: input.profileId },
        include: { content: true },
        orderBy: { startedAt: "desc" },
        skip: offset,
        take: limit,
      }),
      this.prisma.playbackSession.count({
        where: { childProfileId: input.profileId },
      }),
    ]);

    return paginatedResponse(
      items.map((s) => ({
        id: s.id,
        contentId: s.contentId,
        contentTitle: s.content.title,
        contentType: s.content.contentType,
        thumbnailUrl: s.content.thumbnailUrl,
        startedAt: s.startedAt.toISOString(),
        endedAt: s.endedAt?.toISOString() ?? null,
        durationSeconds: s.durationSeconds,
      })),
      total,
      { offset, limit }
    );
  }
}
