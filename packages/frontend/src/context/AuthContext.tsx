import { createContext } from "react";
import type { User, LoginInput, RegisterInput } from "@/types/user";

export interface AuthContext {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  loginWithGoogle: (tokens: { accessToken: string; refreshToken: string; user: User }) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContext | null>(null);
