import { PAGINATION_DEFAULTS } from "../../config/constants.js";

export function paginate(page?: number, limit?: number) {
  const p = Math.max(1, page || PAGINATION_DEFAULTS.page);
  const l = Math.min(PAGINATION_DEFAULTS.maxLimit, Math.max(1, limit || PAGINATION_DEFAULTS.limit));
  const offset = (p - 1) * l;

  return { page: p, limit: l, offset };
}

export function paginationMeta(total: number, page: number, limit: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
