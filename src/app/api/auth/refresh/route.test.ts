// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/lib/auth", () => ({
  getRefreshToken: vi.fn(),
  setAuthCookies: vi.fn(),
  setAuthCookiesOnResponse: vi.fn(),
}));

import { getRefreshToken, setAuthCookiesOnResponse } from "@/lib/auth";
import { POST } from "./route";

const mockGetRefreshToken = vi.mocked(getRefreshToken);
const mockSetAuthCookies = vi.mocked(setAuthCookiesOnResponse);

const authData = {
  token: "new-access-token",
  refreshToken: "new-refresh-token",
  user: {
    id: "u1",
    email: "a@b.com",
    firstName: "A",
    lastName: "B",
    role: "Client",
  },
};

describe("auth/refresh route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("should return 401 when no refresh token is present", async () => {
    mockGetRefreshToken.mockResolvedValue(null);

    const response = await POST();

    expect(response.status).toBe(401);
    expect(mockSetAuthCookies).not.toHaveBeenCalled();
  });

  it("should refresh tokens and set auth cookies on success", async () => {
    mockGetRefreshToken.mockResolvedValue("existing-refresh-token");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(authData), { status: 200 }),
    );

    const response = await POST();

    expect(response.status).toBe(200);
    expect(mockSetAuthCookies).toHaveBeenCalledWith(expect.anything(), authData);
    await expect(response.json()).resolves.toEqual({ user: authData.user });
  });

  it("should propagate backend token refresh failure", async () => {
    mockGetRefreshToken.mockResolvedValue("expired-refresh-token");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Token expired" }), {
        status: 401,
      }),
    );

    const response = await POST();

    expect(response.status).toBe(401);
    expect(mockSetAuthCookies).not.toHaveBeenCalled();
  });

  it("should return 502 when the auth service is unreachable", async () => {
    mockGetRefreshToken.mockResolvedValue("valid-refresh-token");
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network"));

    const response = await POST();

    expect(response.status).toBe(502);
  });

  it("should return 500 when BACKEND_URL is not set", async () => {
    vi.stubEnv("BACKEND_URL", "");
    mockGetRefreshToken.mockResolvedValue("valid-refresh-token");

    const response = await POST();

    expect(response.status).toBe(500);
  });
});
