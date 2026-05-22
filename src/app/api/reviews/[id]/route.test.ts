// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

vi.mock("@/lib/backend", () => ({
  backendFetch: vi.fn(),
  isErrorResponse: (r: unknown) => r instanceof NextResponse,
}));

import { backendFetch } from "@/lib/backend";
import { PUT, DELETE } from "./route";

const mockBackendFetch = vi.mocked(backendFetch);

describe("reviews [id] route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("PUT", () => {
    it("should update a review and return updated data", async () => {
      const payload = { id: "1", rating: 4, comment: "Good service" };
      mockBackendFetch.mockResolvedValue({ data: payload, status: 200 });

      const body = { rating: 4, comment: "Good service" };
      const response = await PUT(
        new NextRequest("http://localhost/api/reviews/1", {
          method: "PUT",
          body: JSON.stringify(body),
        }),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(200);
      expect(mockBackendFetch).toHaveBeenCalledWith(
        "/api/v1/reviews/1",
        expect.objectContaining({ method: "PUT", body }),
      );
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Backend down" }, { status: 502 }),
      );

      const response = await PUT(
        new NextRequest("http://localhost/api/reviews/1", {
          method: "PUT",
          body: JSON.stringify({ rating: 4 }),
        }),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(502);
    });

    it("should return 400 for malformed JSON body", async () => {
      const response = await PUT(
        new NextRequest("http://localhost/api/reviews/1", {
          method: "PUT",
          body: "{not json",
        }),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(400);
      expect(mockBackendFetch).not.toHaveBeenCalled();
    });
  });

  describe("DELETE", () => {
    it("should delete a review and return success", async () => {
      mockBackendFetch.mockResolvedValue({ data: undefined, status: 200 });

      const response = await DELETE(
        new NextRequest("http://localhost/api/reviews/1", {
          method: "DELETE",
        }),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({ success: true });
      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/reviews/1", {
        method: "DELETE",
      });
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Backend down" }, { status: 502 }),
      );

      const response = await DELETE(
        new NextRequest("http://localhost/api/reviews/1", {
          method: "DELETE",
        }),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(502);
    });

    it("should use the id from route params in the backend path", async () => {
      mockBackendFetch.mockResolvedValue({ data: undefined, status: 200 });

      await DELETE(
        new NextRequest("http://localhost/api/reviews/3", {
          method: "DELETE",
        }),
        { params: Promise.resolve({ id: "3" }) },
      );

      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/reviews/3", {
        method: "DELETE",
      });
    });
  });
});
