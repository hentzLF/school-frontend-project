// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

vi.mock("@/lib/backend", () => ({
  backendFetch: vi.fn(),
  isErrorResponse: (r: unknown) => r instanceof NextResponse,
}));

import { backendFetch } from "@/lib/backend";
import { GET, PUT, DELETE } from "./route";

const mockBackendFetch = vi.mocked(backendFetch);

describe("listings [id] route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("should return a single listing from the backend", async () => {
      const payload = { id: "1", title: "Tractor service" };
      mockBackendFetch.mockResolvedValue({ data: payload, status: 200 });

      const response = await GET(
        new NextRequest("http://localhost/api/listings/1"),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(payload);
      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/listings/1", {
        requireAuth: false,
      });
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Not found" }, { status: 404 }),
      );

      const response = await GET(
        new NextRequest("http://localhost/api/listings/99"),
        { params: Promise.resolve({ id: "99" }) },
      );

      expect(response.status).toBe(404);
    });

    it("should use the id from route params in the backend path", async () => {
      mockBackendFetch.mockResolvedValue({ data: {}, status: 200 });

      await GET(new NextRequest("http://localhost/api/listings/42"), {
        params: Promise.resolve({ id: "42" }),
      });

      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/listings/42", {
        requireAuth: false,
      });
    });
  });

  describe("PUT", () => {
    it("should update a listing and return updated data", async () => {
      const payload = { id: "1", title: "Updated title" };
      mockBackendFetch.mockResolvedValue({ data: payload, status: 200 });

      const body = { title: "Updated title", description: "desc", price: 100 };
      const response = await PUT(
        new NextRequest("http://localhost/api/listings/1", {
          method: "PUT",
          body: JSON.stringify(body),
        }),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(200);
      expect(mockBackendFetch).toHaveBeenCalledWith(
        "/api/v1/listings/1",
        expect.objectContaining({ method: "PUT", body }),
      );
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Backend down" }, { status: 502 }),
      );

      const response = await PUT(
        new NextRequest("http://localhost/api/listings/1", {
          method: "PUT",
          body: JSON.stringify({ title: "x" }),
        }),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(502);
    });

    it("should return 400 for malformed JSON body", async () => {
      const response = await PUT(
        new NextRequest("http://localhost/api/listings/1", {
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
    it("should delete a listing and return success", async () => {
      mockBackendFetch.mockResolvedValue({ data: undefined, status: 200 });

      const response = await DELETE(
        new NextRequest("http://localhost/api/listings/1", {
          method: "DELETE",
        }),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({ success: true });
      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/listings/1", {
        method: "DELETE",
      });
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Backend down" }, { status: 502 }),
      );

      const response = await DELETE(
        new NextRequest("http://localhost/api/listings/1", {
          method: "DELETE",
        }),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(502);
    });

    it("should use the id from route params in the backend path", async () => {
      mockBackendFetch.mockResolvedValue({ data: undefined, status: 200 });

      await DELETE(
        new NextRequest("http://localhost/api/listings/5", {
          method: "DELETE",
        }),
        { params: Promise.resolve({ id: "5" }) },
      );

      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/listings/5", {
        method: "DELETE",
      });
    });
  });
});
