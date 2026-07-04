export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: { message: string; details?: Record<string, string[]> };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function successResponse<T>(data: T, meta?: ApiResponse["meta"]): ApiResponse<T> {
  return { success: true, data, ...(meta && { meta }) };
}

export function errorResponse(message: string, details?: Record<string, string[]>): ApiResponse {
  return { success: false, error: { message, details } };
}
