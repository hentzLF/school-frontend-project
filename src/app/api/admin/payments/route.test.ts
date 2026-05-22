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

const mockPayments = [
  {
    id: "p1",
    bookingId: "b1",
    amount: 150,
    currency: "EUR",
    status: "Completed",
    createdAt: "2026-06-01T10:00:00Z",
  },
  {
    id: "p2",
    bookingId: "b2",
    amount: 300,
    currency: "EUR",
    status: "Pending",
    createdAt: "2026-06-02T10:00:00Z",
  },
];

describe("admin/payments route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("should return all payments from the backend", async () => {
      mockBackendFetch.mockResolvedValue({ data: mockPayments, status: 200 });

      const response = await GET();

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(mockPayments);
    });

    it("should call the correct backend endpoint", async () => {
      mockBackendFetch.mockResolvedValue({ data: mockPayments, status: 200 });

      await GET();

      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/admin/payments");
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
