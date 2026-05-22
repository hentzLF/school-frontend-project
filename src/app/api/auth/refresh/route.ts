import { NextResponse } from "next/server";
import { getRefreshToken, setAuthCookies } from "@/lib/auth";
import type { AuthResponse } from "@/types/auth";
import type { ApiErrorResponse } from "@/types/api";

export async function POST(): Promise<NextResponse> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${backendUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to reach authentication service" },
      { status: 502 },
    );
  }

  if (!backendResponse.ok) {
    const errorData: ApiErrorResponse = await backendResponse
      .json()
      .catch(() => ({
        message: backendResponse.statusText,
      }));
    return NextResponse.json(
      { error: errorData.message ?? "Token refresh failed" },
      { status: backendResponse.status },
    );
  }

  const authData: AuthResponse = await backendResponse.json();
  await setAuthCookies(authData);

  return NextResponse.json({ user: authData.user }, { status: 200 });
}
