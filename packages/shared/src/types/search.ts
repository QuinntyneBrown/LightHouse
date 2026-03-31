export interface SearchRequest {
  query: string;
  ageBand?: string;
  categoryId?: string;
  contentType?: string;
  offset?: number;
  limit?: number;
}

export interface SearchResponse {
  hits: SearchHit[];
  total: number;
  query: string;
  processingTimeMs: number;
}

export interface SearchHit {
  id: string;
  title: string;
  description: string | null;
  contentType: string;
  thumbnailUrl: string | null;
  ageBands: string[];
  categories: string[];
  score: number;
}

export interface SearchSuggestion {
  text: string;
  score: number;
}

export interface IndexDocument {
  id: string;
  title: string;
  description: string | null;
  contentType: string;
  thumbnailUrl: string | null;
  ageBands: string[];
  categories: string[];
  tags: string[];
  scriptureRefs: string[];
  publishedAt: string | null;
}
