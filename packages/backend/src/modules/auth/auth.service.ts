import { ApiError } from "../../shared/utils/ApiError.js";
import { hashPassword, comparePassword } from "../../shared/utils/hash.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../shared/utils/token.js";
import { usersRepository } from "../users/users.repository.js";
import { env } from "../../config/env.js";
import type { CreateUserInput, LoginInput, AuthTokens } from "./auth.types.js";
import type { UserResponse } from "./auth.types.js";

function toUserResponse(user: { id: string; email: string; first_name: string; last_name: string; phone: string | null; avatar_url: string | null; role: string; created_at: string }): UserResponse {
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

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email_verified: boolean;
}

async function exchangeCodeForTokens(code: string): Promise<GoogleTokenResponse> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${env.FRONTEND_URL}/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw ApiError.badRequest(`Google token exchange failed: ${error}`);
  }

  return response.json() as Promise<GoogleTokenResponse>;
}

async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw ApiError.badRequest("Failed to get user info from Google");
  }

  return response.json() as Promise<GoogleUserInfo>;
}

export const authService = {
  async register(input: CreateUserInput): Promise<AuthTokens> {
    const existingUser = await usersRepository.findByEmail(input.email);
    if (existingUser) {
      throw ApiError.conflict("Email already registered");
    }

    const password_hash = await hashPassword(input.password);
    const user = await usersRepository.create({ ...input, password_hash });

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken, user };
  },

  async login(input: LoginInput): Promise<AuthTokens> {
    const user = await usersRepository.findByEmail(input.email);
    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    if (!user.password_hash) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const isValid = await comparePassword(input.password, user.password_hash);
    if (!isValid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    if (!user.is_active) {
      throw ApiError.forbidden("Account is disabled");
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken, user: toUserResponse(user) };
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await usersRepository.findById(payload.userId);

      if (!user.is_active) {
        throw ApiError.forbidden("Account is disabled");
      }

      const newAccessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return { accessToken: newAccessToken };
    } catch {
      throw ApiError.unauthorized("Invalid or expired refresh token");
    }
  },

  async googleLogin(code: string): Promise<AuthTokens> {
    const tokenResponse = await exchangeCodeForTokens(code);
    const googleUser = await getGoogleUserInfo(tokenResponse.access_token);

    let user = await usersRepository.findByGoogleId(googleUser.sub);

    if (!user) {
      const existingUser = await usersRepository.findByEmail(googleUser.email);
      if (existingUser) {
        user = await usersRepository.update(existingUser.id, {
          google_id: googleUser.sub,
          avatar_url: googleUser.picture,
        });
      } else {
        const newUser = await usersRepository.createFromGoogle({
          email: googleUser.email,
          first_name: googleUser.given_name || googleUser.name,
          last_name: googleUser.family_name || "",
          avatar_url: googleUser.picture,
          google_id: googleUser.sub,
        });
        user = { ...newUser, password_hash: null, is_active: true } as import("../users/users.repository.js").UserRow;
      }
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken, user: toUserResponse(user) };
  },
};
