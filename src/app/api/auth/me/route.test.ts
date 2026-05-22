// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";

vi.mock("@/lib/backend", () => ({
  backendFetch: vi.fn(),
  isErrorResponse: (r: unknown) => r instanceof NextResponse,
}));

import { backendFetch } from "@/lib/backend";
import { GET } from "./route";

const mockBackendFetch = vi.mocked(backendFetch);

const mockUser = {
  id: "u1",
  email: "farmer@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "Client",
};

describe("auth/me route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return the current user from the backend", async () => {
    mockBackendFetch.mockResolvedValue({ data: mockUser, status: 200 });

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(mockUser);
  });

  it("should call the correct backend endpoint", async () => {
    mockBackendFetch.mockResolvedValue({ data: mockUser, status: 200 });

    await GET();

    expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/auth/me");
  });

  it("should propagate a backend error response", async () => {
    mockBackendFetch.mockResolvedValue(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    );

    const response = await GET();

    expect(response.status).toBe(401);
  });

  it("should propagate a 403 forbidden response", async () => {
    mockBackendFetch.mockResolvedValue(
      NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    );

    const response = await GET();

    expect(response.status).toBe(403);
  });
});
