import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { setAuthCookiesOnResponse } from "@/lib/auth";
import type { AuthResponse } from "@/types/auth";
import type { ApiErrorResponse } from "@/types/api";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
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

  const parsed = registerSchema.safeParse(body);
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
    backendResponse = await fetch(`${backendUrl}/api/v1/auth/register`, {
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
      { error: errorData.message ?? "Registration failed" },
      { status: backendResponse.status },
    );
  }

  const text = await backendResponse.text();
  if (!text) {
    // Backend returned 201 with no body — registration succeeded, prompt login
    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 },
    );
  }

  let authData: AuthResponse;
  try {
    authData = JSON.parse(text) as AuthResponse;
  } catch {
    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 },
    );
  }

  const response = NextResponse.json({ user: authData.user }, { status: 201 });
  setAuthCookiesOnResponse(response, authData);

  return response;
}
