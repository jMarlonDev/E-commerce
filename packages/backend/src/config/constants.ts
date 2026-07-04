export const CORS_ORIGINS = {
  development: ["http://localhost:5173"],
  production: [] as string[],
};

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 12,
  maxLimit: 100,
};

export const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

export const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"] as const;

export const ROLES = ["customer", "admin"] as const;
