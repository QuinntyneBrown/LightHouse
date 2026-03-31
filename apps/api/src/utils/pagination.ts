export interface PaginationParams {
  offset: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  offset: number;
  limit: number;
}

export function parsePagination(
  query: { offset?: number | string; limit?: number | string },
  defaults: { maxLimit: number } = { maxLimit: 100 }
): PaginationParams {
  const offset = Math.max(0, parseInt(String(query.offset ?? "0"), 10) || 0);
  const limit = Math.min(
    defaults.maxLimit,
    Math.max(1, parseInt(String(query.limit ?? "20"), 10) || 20)
  );
  return { offset, limit };
}

export function paginatedResponse<T>(
  items: T[],
  total: number,
  params: PaginationParams
): PaginatedResult<T> {
  return {
    items,
    total,
    offset: params.offset,
    limit: params.limit,
  };
}
