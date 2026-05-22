// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextResponse } from "next/server";

vi.mock("@/lib/auth", () => ({
  getToken: vi.fn(),
  getRefreshToken: vi.fn(),
  setAuthCookies: vi.fn(),
}));

import { backendFetch, isErrorResponse } from "./backend";
import { getToken, getRefreshToken, setAuthCookies } from "@/lib/auth";

const mockGetToken = vi.mocked(getToken);
const mockGetRefreshToken = vi.mocked(getRefreshToken);
const mockSetAuthCookies = vi.mocked(setAuthCookies);

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("backendFetch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetToken.mockResolvedValue("valid-token");
    mockGetRefreshToken.mockResolvedValue("valid-refresh");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("should return data on a successful authenticated request", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ id: "1" }, 200),
    );
    const result = await backendFetch<{ id: string }>("/api/v1/listings/1");
    expect(isErrorResponse(result)).toBe(false);
    if (!isErrorResponse(result)) {
      expect(result.data).toEqual({ id: "1" });
      expect(result.status).toBe(200);
    }
  });

  it("should attach the bearer token to authenticated requests", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(jsonResponse({}, 200));
    await backendFetch("/api/v1/listings");
    expect(fetchSpy).toHaveBeenCalledWith(
      "http://test-backend/api/v1/listings",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer valid-token",
        }),
      }),
    );
  });

  it("should return 500 when BACKEND_URL is not configured", async () => {
    vi.stubEnv("BACKEND_URL", "");
    const result = await backendFetch("/api/v1/listings");
    expect(isErrorResponse(result)).toBe(true);
    if (isErrorResponse(result)) expect(result.status).toBe(500);
  });

  it("should return 401 when auth is required but no token exists", async () => {
    mockGetToken.mockResolvedValue(undefined);
    const result = await backendFetch("/api/v1/listings");
    expect(isErrorResponse(result)).toBe(true);
    if (isErrorResponse(result)) expect(result.status).toBe(401);
  });

  it("should skip the token when requireAuth is false", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(jsonResponse([], 200));
    await backendFetch("/api/v1/counties", { requireAuth: false });
    expect(mockGetToken).not.toHaveBeenCalled();
    const headers = (fetchSpy.mock.calls[0][1] as RequestInit)
      .headers as Record<string, string>;
    expect(headers.Authorization).toBeUndefined();
  });

  it("should return 502 when the backend is unreachable", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network"));
    const result = await backendFetch("/api/v1/listings");
    expect(isErrorResponse(result)).toBe(true);
    if (isErrorResponse(result)) expect(result.status).toBe(502);
  });

  it("should propagate backend error responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ message: "Not found" }, 404),
    );
    const result = await backendFetch("/api/v1/listings/x");
    expect(isErrorResponse(result)).toBe(true);
    if (isErrorResponse(result)) expect(result.status).toBe(404);
  });

  it("should return undefined data for 204 responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 204 }),
    );
    const result = await backendFetch("/api/v1/bookings/1");
    expect(isErrorResponse(result)).toBe(false);
    if (!isErrorResponse(result)) {
      expect(result.data).toBeUndefined();
      expect(result.status).toBe(204);
    }
  });

  it("should serialize the request body for write operations", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(jsonResponse({ id: "1" }, 201));
    await backendFetch("/api/v1/listings", {
      method: "POST",
      body: { title: "Tractor" },
    });
    expect(fetchSpy).toHaveBeenCalledWith(
      "http://test-backend/api/v1/listings",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ title: "Tractor" }),
      }),
    );
  });

  describe("transparent token refresh", () => {
    it("should refresh and retry once when the backend returns 401", async () => {
      const fetchSpy = vi
        .spyOn(globalThis, "fetch")
        .mockResolvedValueOnce(jsonResponse({ error: "expired" }, 401))
        .mockResolvedValueOnce(
          jsonResponse(
            {
              token: "new-token",
              refreshToken: "new-refresh",
              user: { id: "u1" },
            },
            200,
          ),
        )
        .mockResolvedValueOnce(jsonResponse({ id: "1" }, 200));

      const result = await backendFetch<{ id: string }>("/api/v1/listings/1");

      expect(isErrorResponse(result)).toBe(false);
      if (!isErrorResponse(result)) expect(result.data).toEqual({ id: "1" });
      // original request, refresh request, retried request
      expect(fetchSpy).toHaveBeenCalledTimes(3);
      expect(mockSetAuthCookies).toHaveBeenCalledOnce();
      expect(fetchSpy.mock.calls[2][0]).toBe(
        "http://test-backend/api/v1/listings/1",
      );
      const retryHeaders = (fetchSpy.mock.calls[2][1] as RequestInit)
        .headers as Record<string, string>;
      expect(retryHeaders.Authorization).toBe("Bearer new-token");
    });

    it("should return 401 when the refresh request itself fails", async () => {
      vi.spyOn(globalThis, "fetch")
        .mockResolvedValueOnce(jsonResponse({ error: "expired" }, 401))
        .mockResolvedValueOnce(jsonResponse({ error: "invalid" }, 401));

      const result = await backendFetch("/api/v1/listings");
      expect(isErrorResponse(result)).toBe(true);
      if (isErrorResponse(result)) expect(result.status).toBe(401);
      expect(mockSetAuthCookies).not.toHaveBeenCalled();
    });

    it("should not attempt a refresh when no refresh token is present", async () => {
      mockGetRefreshToken.mockResolvedValue(undefined);
      const fetchSpy = vi
        .spyOn(globalThis, "fetch")
        .mockResolvedValue(jsonResponse({ error: "expired" }, 401));

      const result = await backendFetch("/api/v1/listings");
      expect(isErrorResponse(result)).toBe(true);
      if (isErrorResponse(result)) expect(result.status).toBe(401);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });
});

describe("isErrorResponse", () => {
  it("should identify a NextResponse as an error result", () => {
    expect(isErrorResponse(NextResponse.json({}, { status: 500 }))).toBe(true);
  });

  it("should identify a data result as not an error", () => {
    expect(isErrorResponse({ data: {}, status: 200 })).toBe(false);
  });
});
