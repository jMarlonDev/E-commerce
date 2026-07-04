export interface CreateUserInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface GoogleLoginInput {
  code: string;
}

export interface UserResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}
