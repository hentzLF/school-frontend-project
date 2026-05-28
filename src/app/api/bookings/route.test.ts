// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

vi.mock("@/lib/backend", () => ({
  backendFetch: vi.fn(),
  isErrorResponse: (r: unknown) => r instanceof NextResponse,
}));

import { backendFetch } from "@/lib/backend";
import { GET, POST } from "./route";

const mockBackendFetch = vi.mocked(backendFetch);

describe("bookings route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("should return booking items from the paginated backend response", async () => {
      const items = [{ id: "1", serviceListingId: "listing-1" }];
      mockBackendFetch.mockResolvedValue({
        data: { items, totalCount: 1, page: 1, pageSize: 20, totalPages: 1 },
        status: 200,
      });

      const response = await GET(
        new NextRequest("http://localhost/api/bookings"),
      );

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(items);
      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/bookings");
    });

    it("should forward query parameters to the backend", async () => {
      mockBackendFetch.mockResolvedValue({
        data: { items: [], totalCount: 0, page: 1, pageSize: 20, totalPages: 0 },
        status: 200,
      });

      await GET(
        new NextRequest("http://localhost/api/bookings?status=Confirmed"),
      );

      expect(mockBackendFetch).toHaveBeenCalledWith(
        "/api/v1/bookings?status=Confirmed",
      );
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Backend down" }, { status: 502 }),
      );

      const response = await GET(
        new NextRequest("http://localhost/api/bookings"),
      );

      expect(response.status).toBe(502);
    });
  });

  describe("POST", () => {
    const validBody = {
      serviceListingId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      availabilityId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      areaInHectares: 5.5,
      notes: "Please be on time",
    };

    it("should create a booking with valid input", async () => {
      mockBackendFetch.mockResolvedValue({
        data: { id: "1", ...validBody },
        status: 201,
      });

      const response = await POST(
        new NextRequest("http://localhost/api/bookings", {
          method: "POST",
          body: JSON.stringify(validBody),
        }),
      );

      expect(response.status).toBe(201);
      expect(mockBackendFetch).toHaveBeenCalledWith(
        "/api/v1/bookings",
        expect.objectContaining({ method: "POST", body: validBody }),
      );
    });

    it("should reject invalid input with 400", async () => {
      const response = await POST(
        new NextRequest("http://localhost/api/bookings", {
          method: "POST",
          body: JSON.stringify({ serviceListingId: "", areaInHectares: -1 }),
        }),
      );

      expect(response.status).toBe(400);
      expect(mockBackendFetch).not.toHaveBeenCalled();
    });

    it("should reject malformed JSON body with 400", async () => {
      const response = await POST(
        new NextRequest("http://localhost/api/bookings", {
          method: "POST",
          body: "{not json",
        }),
      );

      expect(response.status).toBe(400);
      expect(mockBackendFetch).not.toHaveBeenCalled();
    });
  });
});
