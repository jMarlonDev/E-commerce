import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { env } from "../../config/env.js";
import type { AuthPayload } from "../../middleware/auth.js";

export function generateAccessToken(payload: AuthPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
}

export function generateRefreshToken(payload: AuthPayload): string {
  return jwt.sign({ ...payload, jti: uuidv4() }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function verifyRefreshToken(token: string): AuthPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as AuthPayload;
}
