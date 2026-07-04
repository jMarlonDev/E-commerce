import { ApiError } from "../../shared/utils/ApiError.js";
import { usersRepository, type UserRow } from "./users.repository.js";
import type { UserResponse } from "../auth/auth.types.js";

function toUserResponse(user: UserRow): UserResponse {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    avatar_url: user.avatar_url,
    role: user.role,
    created_at: user.created_at,
  };
}

export const usersService = {
  async getProfile(userId: string): Promise<UserResponse> {
    const user = await usersRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return toUserResponse(user);
  },

  async updateProfile(userId: string, updates: Partial<UserResponse>): Promise<UserResponse> {
    const allowedFields: (keyof UserResponse)[] = ["first_name", "last_name", "phone", "avatar_url"];
    const filteredUpdates: Record<string, string | null> = {};

    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key] ?? null;
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      throw ApiError.badRequest("No valid fields to update");
    }

    const updated = await usersRepository.update(userId, filteredUpdates);
    return toUserResponse(updated);
  },
};
