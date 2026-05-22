// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const cookieStore = new Map<string, string>();

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (key: string) =>
      cookieStore.has(key) ? { value: cookieStore.get(key) } : undefined,
    set: (key: string, value: string) => {
      cookieStore.set(key, value);
    },
    delete: (key: string) => {
      cookieStore.delete(key);
    },
  }),
}));

import {
  setAuthCookies,
  clearAuthCookies,
  getToken,
  getRefreshToken,
  getCurrentUser,
  TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "./auth";

const authResponse = {
  token: "access-123",
  refreshToken: "refresh-456",
  user: {
    id: "u1",
    email: "a@b.com",
    firstName: "A",
    lastName: "B",
    role: "Client" as const,
  },
};

describe("auth cookie helpers", () => {
  beforeEach(() => {
    cookieStore.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should store the access and refresh tokens as cookies", async () => {
    await setAuthCookies(authResponse);
    expect(cookieStore.get(TOKEN_COOKIE)).toBe("access-123");
    expect(cookieStore.get(REFRESH_TOKEN_COOKIE)).toBe("refresh-456");
  });

  it("should clear both auth cookies", async () => {
    await setAuthCookies(authResponse);
    await clearAuthCookies();
    expect(cookieStore.has(TOKEN_COOKIE)).toBe(false);
    expect(cookieStore.has(REFRESH_TOKEN_COOKIE)).toBe(false);
  });

  it("should read the access token", async () => {
    await setAuthCookies(authResponse);
    expect(await getToken()).toBe("access-123");
  });

  it("should read the refresh token", async () => {
    await setAuthCookies(authResponse);
    expect(await getRefreshToken()).toBe("refresh-456");
  });

  it("should return undefined when no token cookie is set", async () => {
    expect(await getToken()).toBeUndefined();
  });
});

describe("getCurrentUser", () => {
  beforeEach(() => {
    cookieStore.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return null when there is no token", async () => {
    expect(await getCurrentUser()).toBeNull();
  });

  it("should return the user when the backend responds OK", async () => {
    await setAuthCookies(authResponse);
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(authResponse.user), { status: 200 }),
    );
    expect(await getCurrentUser()).toEqual(authResponse.user);
  });

  it("should return null when the backend rejects the token", async () => {
    await setAuthCookies(authResponse);
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 }),
    );
    expect(await getCurrentUser()).toBeNull();
  });

  it("should return null when the backend is unreachable", async () => {
    await setAuthCookies(authResponse);
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network"));
    expect(await getCurrentUser()).toBeNull();
  });
});
