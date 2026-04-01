import type { PrismaClient, Prisma, AgeBand, ContentType, ContentStatus } from "@prisma/client";
import { MeiliSearch } from "meilisearch";
import { NotFoundError } from "../../utils/errors.js";
import type { ContentCreateInput, ContentUpdateInput, ContentFilterInput } from "./schema.js";
import { parsePagination, paginatedResponse } from "../../utils/pagination.js";

const CONTENT_INDEX = "content";

export class ContentService {
  private meili: MeiliSearch;

  constructor(
    private prisma: PrismaClient,
    meiliUrl: string,
    meiliKey: string
  ) {
    this.meili = new MeiliSearch({ host: meiliUrl, apiKey: meiliKey });
  }

  async list(filter: ContentFilterInput) {
    const { offset, limit } = parsePagination(filter);

    const where: Prisma.ContentWhereInput = {};

    if (filter.status) {
      where.status = filter.status as ContentStatus;
    } else {
      where.status = "PUBLISHED";
    }

    if (filter.contentType) {
      where.contentType = filter.contentType as ContentType;
    }

    if (filter.isFeatured !== undefined) {
      where.isFeatured = filter.isFeatured;
    }

    if (filter.ageBand) {
      where.ageBands = {
        some: { ageBand: filter.ageBand as AgeBand },
      };
    }

    if (filter.categoryId) {
      where.categories = {
        some: { categoryId: filter.categoryId },
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.content.findMany({
        where,
        include: {
          ageBands: true,
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
          scriptureRefs: true,
        },
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.content.count({ where }),
    ]);

    return paginatedResponse(items.map(this.formatContent), total, { offset, limit });
  }

  async getById(contentId: string) {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
      include: {
        ageBands: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        scriptureRefs: true,
      },
    });
    if (!content) throw new NotFoundError("Content", contentId);
    return this.formatContent(content);
  }

  async create(input: ContentCreateInput, createdById?: string) {
    // Ensure tags exist
    const tagRecords = input.tags
      ? await Promise.all(
          input.tags.map((name) =>
            this.prisma.tag.upsert({
              where: { name },
              create: { name },
              update: {},
            })
          )
        )
      : [];

    const content = await this.prisma.content.create({
      data: {
        title: input.title,
        description: input.description,
        contentType: input.contentType as ContentType,
        durationSeconds: input.durationSeconds,
        thumbnailUrl: input.thumbnailUrl,
        createdById,
        ageBands: {
          create: input.ageBands.map((ab) => ({ ageBand: ab as AgeBand })),
        },
        categories: {
          create: input.categoryIds.map((catId) => ({ categoryId: catId })),
        },
        tags: {
          create: tagRecords.map((t) => ({ tagId: t.id })),
        },
      },
      include: {
        ageBands: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        scriptureRefs: true,
      },
    });

    return this.formatContent(content);
  }

  async update(contentId: string, input: ContentUpdateInput) {
    const existing = await this.prisma.content.findUnique({ where: { id: contentId } });
    if (!existing) throw new NotFoundError("Content", contentId);

    // Handle tag updates
    if (input.tags) {
      const tagRecords = await Promise.all(
        input.tags.map((name) =>
          this.prisma.tag.upsert({
            where: { name },
            create: { name },
            update: {},
          })
        )
      );
      await this.prisma.contentTag.deleteMany({ where: { contentId } });
      await this.prisma.contentTag.createMany({
        data: tagRecords.map((t) => ({ contentId, tagId: t.id })),
      });
    }

    // Handle age band updates
    if (input.ageBands) {
      await this.prisma.contentAgeBand.deleteMany({ where: { contentId } });
      await this.prisma.contentAgeBand.createMany({
        data: input.ageBands.map((ab) => ({ contentId, ageBand: ab as AgeBand })),
      });
    }

    // Handle category updates
    if (input.categoryIds) {
      await this.prisma.contentCategory.deleteMany({ where: { contentId } });
      await this.prisma.contentCategory.createMany({
        data: input.categoryIds.map((catId) => ({ contentId, categoryId: catId })),
      });
    }

    const content = await this.prisma.content.update({
      where: { id: contentId },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.durationSeconds !== undefined && { durationSeconds: input.durationSeconds }),
        ...(input.thumbnailUrl !== undefined && { thumbnailUrl: input.thumbnailUrl }),
        ...(input.isFeatured !== undefined && { isFeatured: input.isFeatured }),
      },
      include: {
        ageBands: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        scriptureRefs: true,
      },
    });

    return this.formatContent(content);
  }

  async delete(contentId: string) {
    const existing = await this.prisma.content.findUnique({ where: { id: contentId } });
    if (!existing) throw new NotFoundError("Content", contentId);
    await this.prisma.content.delete({ where: { id: contentId } });

    // Remove from search index
    try {
      await this.meili.index(CONTENT_INDEX).deleteDocument(contentId);
    } catch {
      // Index may not exist yet
    }
  }

  async publish(contentId: string) {
    const content = await this.prisma.content.update({
      where: { id: contentId },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
      include: {
        ageBands: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        scriptureRefs: true,
      },
    });

    // Index in Meilisearch
    await this.indexContent(content);

    return this.formatContent(content);
  }

  async getFeatured(ageBand?: string) {
    const where: Prisma.ContentWhereInput = {
      isFeatured: true,
      status: "PUBLISHED",
    };

    if (ageBand) {
      where.ageBands = { some: { ageBand: ageBand as AgeBand } };
    }

    const items = await this.prisma.content.findMany({
      where,
      include: {
        ageBands: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        scriptureRefs: true,
      },
      take: 20,
      orderBy: { publishedAt: "desc" },
    });

    return items.map(this.formatContent);
  }

  async listCategories() {
    return this.prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }

  async listForChild(profileId: string, filter: ContentFilterInput) {
    const profile = await this.prisma.childProfile.findUnique({
      where: { id: profileId },
    });
    if (!profile) throw new NotFoundError("ChildProfile", profileId);

    // Get blocked content IDs
    const blocked = await this.prisma.blockedContent.findMany({
      where: { childProfileId: profileId },
      select: { contentId: true },
    });
    const blockedIds = blocked.map((b) => b.contentId);

    const { offset, limit } = parsePagination(filter);

    const where: Prisma.ContentWhereInput = {
      status: "PUBLISHED",
      ageBands: { some: { ageBand: profile.ageBand } },
      ...(blockedIds.length > 0 && { id: { notIn: blockedIds } }),
    };

    if (filter.categoryId) {
      where.categories = { some: { categoryId: filter.categoryId } };
    }
    if (filter.contentType) {
      where.contentType = filter.contentType as ContentType;
    }

    const [items, total] = await Promise.all([
      this.prisma.content.findMany({
        where,
        include: {
          ageBands: true,
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
          scriptureRefs: true,
        },
        skip: offset,
        take: limit,
        orderBy: { publishedAt: "desc" },
      }),
      this.prisma.content.count({ where }),
    ]);

    return paginatedResponse(items.map(this.formatContent), total, { offset, limit });
  }

  private async indexContent(content: any) {
    try {
      const doc = {
        id: content.id,
        title: content.title,
        description: content.description,
        contentType: content.contentType,
        thumbnailUrl: content.thumbnailUrl,
        ageBands: content.ageBands.map((ab: any) => ab.ageBand),
        categories: content.categories.map((cc: any) => cc.category.name),
        tags: content.tags.map((ct: any) => ct.tag.name),
        scriptureRefs: content.scriptureRefs.map(
          (sr: any) => `${sr.book} ${sr.chapter}:${sr.verseFrom}${sr.verseTo ? `-${sr.verseTo}` : ""}`
        ),
        publishedAt: content.publishedAt?.toISOString() ?? null,
      };
      await this.meili.index(CONTENT_INDEX).addDocuments([doc]);
    } catch (err) {
      // Log but don't fail the operation
      console.error("Failed to index content in Meilisearch:", err);
    }
  }

  private formatContent(content: any) {
    return {
      id: content.id,
      title: content.title,
      description: content.description,
      contentType: content.contentType,
      status: content.status,
      durationSeconds: content.durationSeconds,
      thumbnailUrl: content.thumbnailUrl,
      isFeatured: content.isFeatured,
      publishedAt: content.publishedAt?.toISOString() ?? null,
      ageBands: content.ageBands.map((ab: any) => ab.ageBand),
      categories: content.categories.map((cc: any) => ({
        id: cc.category.id,
        name: cc.category.name,
        slug: cc.category.slug,
        description: cc.category.description,
        iconName: cc.category.iconName,
        sortOrder: cc.category.sortOrder,
      })),
      tags: content.tags.map((ct: any) => ct.tag.name),
      scriptureRefs: content.scriptureRefs.map((sr: any) => ({
        id: sr.id,
        book: sr.book,
        chapter: sr.chapter,
        verseFrom: sr.verseFrom,
        verseTo: sr.verseTo,
      })),
      createdAt: content.createdAt.toISOString(),
      updatedAt: content.updatedAt.toISOString(),
    };
  }
}
