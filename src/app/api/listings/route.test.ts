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

describe("listings route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("should return listing data from the backend", async () => {
      const payload = { items: [], total: 0, page: 1, pageSize: 20 };
      mockBackendFetch.mockResolvedValue({ data: payload, status: 200 });

      const response = await GET(
        new NextRequest("http://localhost/api/listings"),
      );

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(payload);
    });

    it("should forward query parameters and not require auth", async () => {
      mockBackendFetch.mockResolvedValue({ data: {}, status: 200 });

      await GET(
        new NextRequest("http://localhost/api/listings?search=tractor&page=2"),
      );

      expect(mockBackendFetch).toHaveBeenCalledWith(
        "/api/v1/listings?search=tractor&page=2",
        { requireAuth: false },
      );
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Backend down" }, { status: 502 }),
      );

      const response = await GET(
        new NextRequest("http://localhost/api/listings"),
      );

      expect(response.status).toBe(502);
    });
  });

  describe("POST", () => {
    const validBody = {
      title: "Tractor service",
      description: "Plowing and tilling",
      pricePerHectare: 50,
      serviceCategoryId: "cat-1",
    };

    it("should create a listing with valid input", async () => {
      mockBackendFetch.mockResolvedValue({
        data: { id: "1", ...validBody },
        status: 201,
      });

      const response = await POST(
        new NextRequest("http://localhost/api/listings", {
          method: "POST",
          body: JSON.stringify(validBody),
        }),
      );

      expect(response.status).toBe(201);
      expect(mockBackendFetch).toHaveBeenCalledWith(
        "/api/v1/listings",
        expect.objectContaining({ method: "POST", body: validBody }),
      );
    });

    it("should reject invalid input with 400", async () => {
      const response = await POST(
        new NextRequest("http://localhost/api/listings", {
          method: "POST",
          body: JSON.stringify({ title: "" }),
        }),
      );

      expect(response.status).toBe(400);
      expect(mockBackendFetch).not.toHaveBeenCalled();
    });

    it("should reject a malformed JSON body with 400", async () => {
      const response = await POST(
        new NextRequest("http://localhost/api/listings", {
          method: "POST",
          body: "{not json",
        }),
      );

      expect(response.status).toBe(400);
    });
  });
});
