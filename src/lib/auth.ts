import { cookies } from "next/headers";
import type { AuthResponse } from "@/types/auth";

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

export async function setAuthCookies(authResponse: AuthResponse): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE, authResponse.token, cookieOptions);
  cookieStore.set(REFRESH_TOKEN_COOKIE, authResponse.refreshToken, cookieOptions);
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
