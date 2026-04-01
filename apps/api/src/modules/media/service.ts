import type { PrismaClient } from "@prisma/client";
import * as Minio from "minio";
import crypto from "crypto";
import { NotFoundError } from "../../utils/errors.js";
import type { UploadUrlRequestInput, UploadConfirmInput } from "./schema.js";

export class MediaService {
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

  async getUploadUrl(input: UploadUrlRequestInput) {
    const content = await this.prisma.content.findUnique({
      where: { id: input.contentId },
    });
    if (!content) throw new NotFoundError("Content", input.contentId);

    const ext = input.filename.split(".").pop() ?? "bin";
    const key = `uploads/${input.contentId}/${crypto.randomUUID()}.${ext}`;

    // Ensure bucket exists
    try {
      const exists = await this.minioClient.bucketExists(this.bucket);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucket);
      }
    } catch {
      // Ignore bucket check errors in dev
    }

    const expiresIn = 3600;
    let uploadUrl: string;

    try {
      uploadUrl = await this.minioClient.presignedPutObject(this.bucket, key, expiresIn);
    } catch {
      // If MinIO is not available, return a placeholder
      uploadUrl = `http://localhost:9000/${this.bucket}/${key}`;
    }

    return {
      uploadUrl,
      key,
      expiresIn,
    };
  }

  async confirmUpload(input: UploadConfirmInput) {
    const content = await this.prisma.content.findUnique({
      where: { id: input.contentId },
    });
    if (!content) throw new NotFoundError("Content", input.contentId);

    const asset = await this.prisma.mediaAsset.create({
      data: {
        contentId: input.contentId,
        originalKey: input.key,
        mimeType: input.mimeType,
        sizeBytes: BigInt(input.sizeBytes),
      },
    });

    // Create a placeholder transcoding job
    await this.prisma.transcodingJob.create({
      data: {
        mediaAssetId: asset.id,
        targetFormat: "mp4",
        status: "PENDING",
      },
    });

    return {
      assetId: asset.id,
      key: asset.originalKey,
      mimeType: asset.mimeType,
      sizeBytes: Number(asset.sizeBytes),
    };
  }

  async getTranscodingStatus(assetId: string) {
    const jobs = await this.prisma.transcodingJob.findMany({
      where: { mediaAssetId: assetId },
      orderBy: { createdAt: "desc" },
    });

    if (jobs.length === 0) {
      throw new NotFoundError("TranscodingJob for asset", assetId);
    }

    return jobs.map((job) => ({
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      targetFormat: job.targetFormat,
      errorMessage: job.errorMessage,
      startedAt: job.startedAt?.toISOString() ?? null,
      completedAt: job.completedAt?.toISOString() ?? null,
    }));
  }

  async listVariants(assetId: string) {
    const asset = await this.prisma.mediaAsset.findUnique({
      where: { id: assetId },
      include: { variants: true },
    });
    if (!asset) throw new NotFoundError("MediaAsset", assetId);

    return asset.variants.map((v) => ({
      id: v.id,
      format: v.format,
      resolution: v.resolution,
      bitrateKbps: v.bitrateKbps,
      sizeBytes: Number(v.sizeBytes),
    }));
  }

  async getDownloadManifest(contentId: string) {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
    });
    if (!content) throw new NotFoundError("Content", contentId);

    const assets = await this.prisma.mediaAsset.findMany({
      where: { contentId },
      include: { variants: true },
    });

    const variants: Array<{
      format: string;
      resolution: string | null;
      downloadUrl: string;
      sizeBytes: number;
    }> = [];

    for (const asset of assets) {
      for (const variant of asset.variants) {
        let downloadUrl: string;
        try {
          downloadUrl = await this.minioClient.presignedGetObject(
            this.bucket,
            variant.variantKey,
            3600
          );
        } catch {
          downloadUrl = `http://localhost:9000/${this.bucket}/${variant.variantKey}`;
        }

        variants.push({
          format: variant.format,
          resolution: variant.resolution,
          downloadUrl,
          sizeBytes: Number(variant.sizeBytes),
        });
      }
    }

    return {
      contentId,
      originalKey: assets[0]?.originalKey ?? null,
      variants,
    };
  }
}
