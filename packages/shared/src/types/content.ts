export interface ContentResponse {
  id: string;
  title: string;
  description: string | null;
  contentType: "VIDEO" | "AUDIO" | "INTERACTIVE" | "READ_ALONG";
  status: "DRAFT" | "IN_REVIEW" | "APPROVED" | "PUBLISHED" | "ARCHIVED";
  durationSeconds: number | null;
  thumbnailUrl: string | null;
  isFeatured: boolean;
  publishedAt: string | null;
  ageBands: string[];
  categories: CategoryResponse[];
  tags: string[];
  scriptureRefs: ScriptureRefResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface ContentListResponse {
  items: ContentResponse[];
  total: number;
  offset: number;
  limit: number;
}

export interface ContentCreateRequest {
  title: string;
  description?: string;
  contentType: "VIDEO" | "AUDIO" | "INTERACTIVE" | "READ_ALONG";
  durationSeconds?: number;
  thumbnailUrl?: string;
  ageBands: string[];
  categoryIds: string[];
  tags?: string[];
}

export interface ContentUpdateRequest {
  title?: string;
  description?: string;
  durationSeconds?: number;
  thumbnailUrl?: string;
  isFeatured?: boolean;
  ageBands?: string[];
  categoryIds?: string[];
  tags?: string[];
}

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconName: string | null;
  sortOrder: number;
}

export interface ScriptureRefResponse {
  id: string;
  book: string;
  chapter: number;
  verseFrom: number;
  verseTo: number | null;
}

export interface ContentFilterParams {
  ageBand?: string;
  categoryId?: string;
  contentType?: string;
  status?: string;
  search?: string;
  isFeatured?: boolean;
  offset?: number;
  limit?: number;
}
