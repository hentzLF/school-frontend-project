import { cookies } from "next/headers";
import type { AuthResponse, User } from "@/types/auth";

export const TOKEN_COOKIE = "token";
export const REFRESH_TOKEN_COOKIE = "refreshToken";

type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
  maxAge: number;
};

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function setAuthCookies(
  authResponse: AuthResponse,
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE, authResponse.token, cookieOptions);
  cookieStore.set(
    REFRESH_TOKEN_COOKIE,
    authResponse.refreshToken,
    cookieOptions,
  );
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
}

/**
 * Resolves the authenticated user from the backend using the JWT cookie.
 * Returns null when there is no token, the backend is unreachable, or the
 * token is rejected. Intended for server-side route protection in layouts.
 */
export async function getCurrentUser(): Promise<User | null> {
  const token = await getToken();
  if (!token) return null;

  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) return null;

  try {
    const response = await fetch(`${backendUrl}/api/v1/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as User;
  } catch {
    return null;
  }
}
