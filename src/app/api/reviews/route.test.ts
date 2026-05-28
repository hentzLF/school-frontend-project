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

describe("reviews route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("should return review items from the paginated backend response", async () => {
      const items = [{ id: "1", rating: 5 }];
      mockBackendFetch.mockResolvedValue({
        data: { items, totalCount: 1, page: 1, pageSize: 20, totalPages: 1 },
        status: 200,
      });

      const response = await GET(
        new NextRequest("http://localhost/api/reviews"),
      );

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(items);
      expect(mockBackendFetch).toHaveBeenCalledWith(
        "/api/v1/reviews",
        { requireAuth: false },
      );
    });

    it("should forward query parameters to the backend", async () => {
      mockBackendFetch.mockResolvedValue({
        data: { items: [], totalCount: 0, page: 1, pageSize: 20, totalPages: 0 },
        status: 200,
      });

      await GET(
        new NextRequest("http://localhost/api/reviews?page=2"),
      );

      expect(mockBackendFetch).toHaveBeenCalledWith(
        "/api/v1/reviews?page=2",
        { requireAuth: false },
      );
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Backend down" }, { status: 502 }),
      );

      const response = await GET(
        new NextRequest("http://localhost/api/reviews"),
      );

      expect(response.status).toBe(502);
    });
  });

  describe("POST", () => {
    const validBody = {
      bookingId: "550e8400-e29b-41d4-a716-446655440001",
      rating: 5,
      comment: "Excellent service, very professional.",
    };

    it("should create a review with valid input", async () => {
      mockBackendFetch.mockResolvedValue({
        data: { id: "1", ...validBody },
        status: 201,
      });

      const response = await POST(
        new NextRequest("http://localhost/api/reviews", {
          method: "POST",
          body: JSON.stringify(validBody),
        }),
      );

      expect(response.status).toBe(201);
      expect(mockBackendFetch).toHaveBeenCalledWith(
        "/api/v1/reviews",
        expect.objectContaining({ method: "POST", body: validBody }),
      );
    });

    it("should reject invalid input with 400", async () => {
      const response = await POST(
        new NextRequest("http://localhost/api/reviews", {
          method: "POST",
          body: JSON.stringify({ listingId: "", rating: 10 }),
        }),
      );

      expect(response.status).toBe(400);
      expect(mockBackendFetch).not.toHaveBeenCalled();
    });

    it("should reject malformed JSON body with 400", async () => {
      const response = await POST(
        new NextRequest("http://localhost/api/reviews", {
          method: "POST",
          body: "{not json",
        }),
      );

      expect(response.status).toBe(400);
      expect(mockBackendFetch).not.toHaveBeenCalled();
    });
  });
});
