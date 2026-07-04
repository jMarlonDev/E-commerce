export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
