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
    it("should return booking data from the backend", async () => {
      const payload = [{ id: "1", listingId: "listing-1" }];
      mockBackendFetch.mockResolvedValue({ data: payload, status: 200 });

      const response = await GET(
        new NextRequest("http://localhost/api/bookings"),
      );

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(payload);
      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/bookings");
    });

    it("should forward query parameters to the backend", async () => {
      mockBackendFetch.mockResolvedValue({ data: [], status: 200 });

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
      listingId: "listing-1",
      startDate: "2024-06-01",
      endDate: "2024-06-07",
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
          body: JSON.stringify({ listingId: "" }),
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
