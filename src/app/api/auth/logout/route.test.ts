// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth", () => ({
  clearAuthCookies: vi.fn(),
}));

import { clearAuthCookies } from "@/lib/auth";
import { POST } from "./route";

const mockClearAuthCookies = vi.mocked(clearAuthCookies);

describe("auth/logout route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should clear auth cookies and return success", async () => {
    mockClearAuthCookies.mockResolvedValue(undefined);

    const response = await POST();

    expect(response.status).toBe(200);
    expect(mockClearAuthCookies).toHaveBeenCalledOnce();
    await expect(response.json()).resolves.toEqual({ success: true });
  });

  it("should call clearAuthCookies exactly once per request", async () => {
    mockClearAuthCookies.mockResolvedValue(undefined);

    await POST();

    expect(mockClearAuthCookies).toHaveBeenCalledTimes(1);
  });

  it("should still return 200 even when called multiple times", async () => {
    mockClearAuthCookies.mockResolvedValue(undefined);

    const r1 = await POST();
    const r2 = await POST();

    expect(r1.status).toBe(200);
    expect(r2.status).toBe(200);
  });
});
