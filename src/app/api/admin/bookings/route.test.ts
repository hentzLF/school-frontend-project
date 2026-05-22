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

const mockBookings = [
  {
    id: "b1",
    listingId: "l1",
    clientId: "u1",
    providerId: "u2",
    status: "Pending",
    startDate: "2026-06-01",
    endDate: "2026-06-02",
  },
  {
    id: "b2",
    listingId: "l2",
    clientId: "u3",
    providerId: "u4",
    status: "Confirmed",
    startDate: "2026-07-01",
    endDate: "2026-07-03",
  },
];

describe("admin/bookings route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("should return all bookings from the backend", async () => {
      mockBackendFetch.mockResolvedValue({ data: mockBookings, status: 200 });

      const response = await GET();

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(mockBookings);
    });

    it("should call the correct backend endpoint", async () => {
      mockBackendFetch.mockResolvedValue({ data: mockBookings, status: 200 });

      await GET();

      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/admin/bookings");
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
