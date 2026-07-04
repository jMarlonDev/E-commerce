import axiosClient from "../axiosClient";
import type { ApiResponse } from "@/types/api";
import type { AuthTokens, User, LoginInput, RegisterInput } from "@/types/user";

export const authApi = {
  async register(data: RegisterInput): Promise<ApiResponse<AuthTokens>> {
    const response = await axiosClient.post<ApiResponse<AuthTokens>>(
      "/auth/register",
      data,
    );
    return response.data;
  },

  async login(data: LoginInput): Promise<ApiResponse<AuthTokens>> {
    const response = await axiosClient.post<ApiResponse<AuthTokens>>(
      "/auth/login",
      data,
    );
    return response.data;
  },

  async refreshToken(
    refreshToken: string,
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    const response = await axiosClient.post<
      ApiResponse<{ accessToken: string; refreshToken: string }>
    >("/auth/refresh", { refreshToken });
    return response.data;
  },

  async loginWithGoogle(code: string): Promise<ApiResponse<AuthTokens>> {
    const response = await axiosClient.post<ApiResponse<AuthTokens>>(
      "/auth/google",
      { code },
    );
    return response.data;
  },

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await axiosClient.get<ApiResponse<User>>("/users/me");
    return response.data;
  },

  async updateProfile(
    data: Partial<Pick<User, "first_name" | "last_name" | "phone">>,
  ): Promise<ApiResponse<User>> {
    const response = await axiosClient.put<ApiResponse<User>>(
      "/users/me",
      data,
    );
    return response.data;
  },
};
