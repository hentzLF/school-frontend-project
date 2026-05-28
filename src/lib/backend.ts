import { NextResponse } from "next/server";
import { getToken, getRefreshToken, setAuthCookies, clearAuthCookiesOnResponse } from "@/lib/auth";
import { normalizeAuthResponse, type RawAuthResponse } from "@/types/auth";

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

async function refreshAccessToken(backendUrl: string): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  try {
    // Backend reads refreshToken from Request.Cookies, not request body
    const response = await fetch(`${backendUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });
    if (!response.ok) return null;

    const rawBody = (await response.json()) as RawAuthResponse;
    const newRefreshToken = extractRefreshTokenCookie(response.headers);
    const authData = normalizeAuthResponse({
      ...rawBody,
      refreshToken: newRefreshToken,
    });
    await setAuthCookies(authData);
    return authData.token || null;
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
    } else {
      // Refresh failed — clear cookies on the response so the browser actually
      // removes them. cookies() store writes don't add Set-Cookie headers in
      // Route Handlers, so clearAuthCookiesOnResponse is required here.
      const unauthResponse = NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
      clearAuthCookiesOnResponse(unauthResponse);
      return unauthResponse;
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: response.statusText,
    }));
    const errResponse = NextResponse.json(
      { error: errorData.message ?? "Request failed" },
      { status: response.status },
    );
    // If a retried request (after successful refresh) is still rejected, clear
    // the cookies so stale state doesn't trap the user at /dashboard.
    if (response.status === 401) {
      clearAuthCookiesOnResponse(errResponse);
    }
    return errResponse;
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
