import { NextResponse } from "next/server";
import { getToken } from "@/lib/auth";

type BackendRequestOptions = {
  method?: string;
  body?: unknown;
  requireAuth?: boolean;
  headers?: Record<string, string>;
};

export async function backendFetch<T>(
  path: string,
  options: BackendRequestOptions = {},
): Promise<{ data: T; status: number } | NextResponse> {
  const { method = "GET", body, requireAuth = true, headers = {} } = options;

  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (requireAuth) {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(`${backendUrl}${path}`, config);
  } catch {
    return NextResponse.json(
      { error: "Failed to reach backend service" },
      { status: 502 },
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: response.statusText,
    }));
    return NextResponse.json(
      { error: errorData.message ?? "Request failed" },
      { status: response.status },
    );
  }

  if (response.status === 204) {
    return { data: undefined as T, status: 204 };
  }

  const data = (await response.json()) as T;
  return { data, status: response.status };
}

export function isErrorResponse(
  result: { data: unknown; status: number } | NextResponse,
): result is NextResponse {
  return result instanceof NextResponse;
}
