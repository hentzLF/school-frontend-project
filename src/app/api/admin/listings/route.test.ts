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

const mockListings = [
  {
    id: "l1",
    title: "Tractor service",
    categoryName: "Plowing",
    providerName: "Farm Co",
    pricePerHectare: 50,
    isActive: true,
  },
  {
    id: "l2",
    title: "Irrigation setup",
    categoryName: "Irrigation",
    providerName: "Agro Ltd",
    pricePerHectare: 200,
    isActive: false,
  },
];

describe("admin/listings route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("should return all listings from the backend", async () => {
      mockBackendFetch.mockResolvedValue({ data: mockListings, status: 200 });

      const response = await GET();

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(mockListings);
    });

    it("should call the correct backend endpoint", async () => {
      mockBackendFetch.mockResolvedValue({ data: mockListings, status: 200 });

      await GET();

      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/admin/listings");
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
