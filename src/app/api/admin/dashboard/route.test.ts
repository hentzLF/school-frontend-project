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

const mockDashboard = {
  totalUsers: 120,
  totalListings: 45,
  totalBookings: 87,
  totalRevenue: 15400,
  activeListings: 30,
  pendingBookings: 12,
};

describe("admin/dashboard route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("should return dashboard data from the backend", async () => {
      mockBackendFetch.mockResolvedValue({ data: mockDashboard, status: 200 });

      const response = await GET();

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(mockDashboard);
    });

    it("should call the correct backend endpoint", async () => {
      mockBackendFetch.mockResolvedValue({ data: mockDashboard, status: 200 });

      await GET();

      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/admin/dashboard");
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
