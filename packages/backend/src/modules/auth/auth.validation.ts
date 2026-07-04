import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  first_name: z.string().min(1, "First name is required").max(100),
  last_name: z.string().min(1, "Last name is required").max(100),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const googleLoginSchema = z.object({
  code: z.string().min(1, "Authorization code is required"),
});
