import { useState, useEffect, useCallback, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { authApi } from "@/api/endpoints/auth";
import { setAuthContext } from "@/api/interceptors/authInterceptor";
import type { User, LoginInput, RegisterInput } from "@/types/user";

const TOKEN_KEY = "auth_tokens";

interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

function getStoredAuth(): StoredTokens | null {
  try {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      return JSON.parse(stored) as StoredTokens;
    }
  } catch {
    localStorage.removeItem(TOKEN_KEY);
  }
  return null;
}

function storeAuth(tokens: StoredTokens) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored?.user && stored?.accessToken) {
      setUser(stored.user);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setAuthContext({ logout });
  }, [logout]);

  const login = useCallback(async (data: LoginInput) => {
    const response = await authApi.login(data);
    if (response.success && response.data) {
      const { accessToken, refreshToken, user: userData } = response.data;
      storeAuth({ accessToken, refreshToken, user: userData });
      setUser(userData);
    } else {
      throw new Error(response.error?.message || "Error al iniciar sesión");
    }
  }, []);

  const register = useCallback(async (data: RegisterInput) => {
    const response = await authApi.register(data);
    if (response.success && response.data) {
      const { accessToken, refreshToken, user: userData } = response.data;
      storeAuth({ accessToken, refreshToken, user: userData });
      setUser(userData);
    } else {
      throw new Error(response.error?.message || "Error al registrar usuario");
    }
  }, []);

  const loginWithGoogle = useCallback(async (tokens: { accessToken: string; refreshToken: string; user: User }) => {
    storeAuth(tokens);
    setUser(tokens.user);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    const stored = getStoredAuth();
    if (stored) {
      storeAuth({ ...stored, user: updatedUser });
    }
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
