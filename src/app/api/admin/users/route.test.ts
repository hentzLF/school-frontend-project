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

const mockUsers = [
  {
    id: "u1",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    role: "Admin",
    isActive: true,
  },
  {
    id: "u2",
    email: "farmer@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "Client",
    isActive: true,
  },
];

describe("admin/users route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("should return all users from the backend", async () => {
      mockBackendFetch.mockResolvedValue({ data: mockUsers, status: 200 });

      const response = await GET();

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(mockUsers);
    });

    it("should call the correct backend endpoint", async () => {
      mockBackendFetch.mockResolvedValue({ data: mockUsers, status: 200 });

      await GET();

      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/admin/users");
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      );

      const response = await GET();

      expect(response.status).toBe(401);
    });

    it("should propagate a 500 internal server error", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Internal Server Error" }, { status: 500 }),
      );

      const response = await GET();

      expect(response.status).toBe(500);
    });
  });
});
