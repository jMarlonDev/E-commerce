export interface PaginatedQuery {
  page?: string;
  limit?: string;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}
