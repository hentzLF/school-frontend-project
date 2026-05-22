import { NextResponse } from "next/server";
import { getToken } from "@/lib/auth";
import type { User } from "@/types/auth";
import type { ApiErrorResponse } from "@/types/api";

export async function GET(): Promise<NextResponse> {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${backendUrl}/api/v1/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to reach authentication service" }, { status: 502 });
  }

  if (!backendResponse.ok) {
    const errorData: ApiErrorResponse = await backendResponse.json().catch(() => ({
      message: backendResponse.statusText,
    }));
    return NextResponse.json(
      { error: errorData.message ?? "Unauthorized" },
      { status: backendResponse.status }
    );
  }

  const user: User = await backendResponse.json();
  return NextResponse.json(user, { status: 200 });
}
