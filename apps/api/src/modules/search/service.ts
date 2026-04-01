import type { PrismaClient } from "@prisma/client";
import { MeiliSearch } from "meilisearch";
import type { SearchQueryInput } from "./schema.js";

const CONTENT_INDEX = "content";

export class SearchService {
  private meili: MeiliSearch;

  constructor(
    private prisma: PrismaClient,
    meiliUrl: string,
    meiliKey: string
  ) {
    this.meili = new MeiliSearch({ host: meiliUrl, apiKey: meiliKey });
  }

  async search(input: SearchQueryInput) {
    const offset = input.offset ?? 0;
    const limit = input.limit ?? 20;

    const filter: string[] = [];

    if (input.ageBand) {
      filter.push(`ageBands = "${input.ageBand}"`);
    }
    if (input.contentType) {
      filter.push(`contentType = "${input.contentType}"`);
    }

    try {
      const result = await this.meili.index(CONTENT_INDEX).search(input.query, {
        offset,
        limit,
        filter: filter.length > 0 ? filter : undefined,
        attributesToRetrieve: [
          "id", "title", "description", "contentType",
          "thumbnailUrl", "ageBands", "categories",
        ],
      });

      return {
        hits: (result.hits as any[]).map((hit) => ({
          id: hit.id,
          title: hit.title,
          description: hit.description,
          contentType: hit.contentType,
          thumbnailUrl: hit.thumbnailUrl,
          ageBands: hit.ageBands ?? [],
          categories: hit.categories ?? [],
          score: hit._rankingScore ?? 0,
        })),
        total: result.estimatedTotalHits ?? 0,
        query: input.query,
        processingTimeMs: result.processingTimeMs ?? 0,
      };
    } catch (err) {
      // If Meilisearch is unavailable, fall back to DB search
      return this.fallbackSearch(input, offset, limit);
    }
  }

  async suggestions(query: string) {
    try {
      const result = await this.meili.index(CONTENT_INDEX).search(query, {
        limit: 5,
        attributesToRetrieve: ["title"],
      });

      return (result.hits as any[]).map((hit) => ({
        text: hit.title,
        score: hit._rankingScore ?? 0,
      }));
    } catch {
      return [];
    }
  }

  async reindex() {
    const allContent = await this.prisma.content.findMany({
      where: { status: "PUBLISHED" },
      include: {
        ageBands: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        scriptureRefs: true,
      },
    });

    const documents = allContent.map((content) => ({
      id: content.id,
      title: content.title,
      description: content.description,
      contentType: content.contentType,
      thumbnailUrl: content.thumbnailUrl,
      ageBands: content.ageBands.map((ab) => ab.ageBand),
      categories: content.categories.map((cc) => cc.category.name),
      tags: content.tags.map((ct) => ct.tag.name),
      scriptureRefs: content.scriptureRefs.map(
        (sr) => `${sr.book} ${sr.chapter}:${sr.verseFrom}${sr.verseTo ? `-${sr.verseTo}` : ""}`
      ),
      publishedAt: content.publishedAt?.toISOString() ?? null,
    }));

    try {
      const index = this.meili.index(CONTENT_INDEX);

      // Configure index settings
      await index.updateFilterableAttributes(["ageBands", "categories", "contentType", "tags"]);
      await index.updateSearchableAttributes(["title", "description", "tags", "scriptureRefs"]);
      await index.updateSortableAttributes(["publishedAt"]);

      // Replace all documents
      const task = await index.addDocuments(documents);
      return {
        taskId: task.taskUid,
        documentsCount: documents.length,
        status: "indexing",
      };
    } catch (err) {
      throw new Error(`Failed to reindex: ${(err as Error).message}`);
    }
  }

  private async fallbackSearch(input: SearchQueryInput, offset: number, limit: number) {
    const where: any = {
      status: "PUBLISHED",
      OR: [
        { title: { contains: input.query, mode: "insensitive" } },
        { description: { contains: input.query, mode: "insensitive" } },
      ],
    };

    if (input.ageBand) {
      where.ageBands = { some: { ageBand: input.ageBand } };
    }
    if (input.contentType) {
      where.contentType = input.contentType;
    }

    const [items, total] = await Promise.all([
      this.prisma.content.findMany({
        where,
        include: {
          ageBands: true,
          categories: { include: { category: true } },
        },
        skip: offset,
        take: limit,
      }),
      this.prisma.content.count({ where }),
    ]);

    return {
      hits: items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        contentType: item.contentType,
        thumbnailUrl: item.thumbnailUrl,
        ageBands: item.ageBands.map((ab) => ab.ageBand),
        categories: item.categories.map((cc) => cc.category.name),
        score: 1,
      })),
      total,
      query: input.query,
      processingTimeMs: 0,
    };
  }
}
