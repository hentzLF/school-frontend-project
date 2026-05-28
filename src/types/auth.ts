export type User = {
  id: string;
  profileId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "Client" | "Provider" | "Admin";
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type AuthResponse = {
  token: string;
  refreshToken: string;
  user: User;
};

// Backend may return accessToken instead of token — normalized at parse time
export type RawAuthResponse = {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
};

export function normalizeAuthResponse(raw: RawAuthResponse): AuthResponse {
  return {
    token: raw.token ?? raw.accessToken ?? "",
    refreshToken: raw.refreshToken ?? "",
    user: raw.user as User,
  };
}
