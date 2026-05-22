import { NextResponse } from "next/server";
import { backendFetch, isErrorResponse } from "@/lib/backend";
import type { User } from "@/types/auth";

export async function GET(): Promise<NextResponse> {
  // Routed through backendFetch so an expired access token is transparently
  // refreshed — the current user is resolved without a visible re-login.
  const result = await backendFetch<User>("/api/v1/auth/me");
  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 200 });
}
