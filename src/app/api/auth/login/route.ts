import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { setAuthCookiesOnResponse } from "@/lib/auth";
import { normalizeAuthResponse, type RawAuthResponse } from "@/types/auth";
import type { ApiErrorResponse } from "@/types/api";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
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
    backendResponse = await fetch(`${backendUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
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
      { error: errorData.message ?? "Login failed" },
      { status: backendResponse.status },
    );
  }

  // Backend returns accessToken in body and refreshToken as a Set-Cookie header
  const rawBody = (await backendResponse.json()) as RawAuthResponse;
  const refreshToken = extractRefreshTokenCookie(backendResponse.headers);
  const authData = normalizeAuthResponse({ ...rawBody, refreshToken });

  const response = NextResponse.json({ user: authData.user }, { status: 200 });
  setAuthCookiesOnResponse(response, authData);

  return response;
}

function extractRefreshTokenCookie(headers: Headers): string | undefined {
  const h = headers as unknown as { getSetCookie?: () => string[] };
  const cookies: string[] =
    typeof h.getSetCookie === "function"
      ? h.getSetCookie()
      : [headers.get("set-cookie") ?? ""];

  for (const cookie of cookies) {
    if (cookie.toLowerCase().startsWith("refreshtoken=")) {
      return cookie.split(";")[0].slice("refreshToken=".length);
    }
  }
  return undefined;
}
