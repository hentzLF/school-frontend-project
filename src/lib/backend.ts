import { NextResponse } from "next/server";
import { getToken, getRefreshToken, setAuthCookies } from "@/lib/auth";
import type { AuthResponse } from "@/types/auth";

type BackendRequestOptions = {
  method?: string;
  body?: unknown;
  requireAuth?: boolean;
  headers?: Record<string, string>;
};

/**
 * Exchanges the refresh-token cookie for a fresh access token and persists the
 * rotated tokens. Returns the new access token, or null when a refresh is not
 * possible (no refresh token, backend rejection, or network failure).
 */
async function refreshAccessToken(backendUrl: string): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${backendUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) return null;

    const authData = (await response.json()) as AuthResponse;
    await setAuthCookies(authData);
    return authData.token;
  } catch {
    return null;
  }
}

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

  let token: string | undefined;
  if (requireAuth) {
    token = await getToken();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const buildRequest = (authToken: string | undefined): RequestInit => {
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };
    if (authToken) {
      requestHeaders["Authorization"] = `Bearer ${authToken}`;
    }
    const config: RequestInit = { method, headers: requestHeaders };
    if (body) {
      config.body = JSON.stringify(body);
    }
    return config;
  };

  let response: Response;
  try {
    response = await fetch(`${backendUrl}${path}`, buildRequest(token));
  } catch {
    return NextResponse.json(
      { error: "Failed to reach backend service" },
      { status: 502 },
    );
  }

  // Transparent refresh: an expired access token surfaces as a 401 from the
  // backend. Swap it for a fresh token via the refresh cookie and retry the
  // request once, so the user never notices the rotation.
  if (requireAuth && response.status === 401) {
    const newToken = await refreshAccessToken(backendUrl);
    if (newToken) {
      try {
        response = await fetch(`${backendUrl}${path}`, buildRequest(newToken));
      } catch {
        return NextResponse.json(
          { error: "Failed to reach backend service" },
          { status: 502 },
        );
      }
    }
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
