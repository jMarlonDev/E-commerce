import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/api";

let authContext: { logout: () => void } | null = null;

export function setAuthContext(context: { logout: () => void }) {
  authContext = context;
}

function getStoredToken(): string | null {
  try {
    const stored = localStorage.getItem("auth_tokens");
    if (stored) {
      const parsed = JSON.parse(stored) as { accessToken: string };
      return parsed.accessToken;
    }
  } catch {
    return null;
  }
  return null;
}

function getStoredRefreshToken(): string | null {
  try {
    const stored = localStorage.getItem("auth_tokens");
    if (stored) {
      const parsed = JSON.parse(stored) as { refreshToken: string };
      return parsed.refreshToken;
    }
  } catch {
    return null;
  }
  return null;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

export function setupAuthInterceptor(client: AxiosInstance) {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getStoredToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return client(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = getStoredRefreshToken();
        if (!refreshToken) {
          isRefreshing = false;
          authContext?.logout();
          return Promise.reject(error);
        }

        try {
          const { data: response } = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
            "/api/v1/auth/refresh",
            { refreshToken },
          );

          if (response.success && response.data) {
            const newTokens = response.data;
            const stored = localStorage.getItem("auth_tokens");
            if (stored) {
              const parsed = JSON.parse(stored);
              parsed.accessToken = newTokens.accessToken;
              parsed.refreshToken = newTokens.refreshToken;
              localStorage.setItem("auth_tokens", JSON.stringify(parsed));
            }

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            }

            processQueue(null, newTokens.accessToken);
            return client(originalRequest);
          } else {
            throw new Error("Token refresh failed");
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          authContext?.logout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );
}
