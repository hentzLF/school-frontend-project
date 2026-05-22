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

const mockCategory = {
  id: "c1",
  name: "Plowing",
  description: "Plowing services",
};

describe("admin/categories/[id] route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("PUT", () => {
    it("should update a category with valid body and return updated category", async () => {
      mockBackendFetch.mockResolvedValue({ data: mockCategory, status: 200 });

      const response = await PUT(
        new NextRequest("http://localhost/api/admin/categories/c1", {
          method: "PUT",
          body: JSON.stringify({ name: "Updated Plowing" }),
        }),
        { params: Promise.resolve({ id: "c1" }) },
      );

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(mockCategory);
    });

    it("should call the correct backend endpoint with the category id", async () => {
      mockBackendFetch.mockResolvedValue({ data: mockCategory, status: 200 });

      await PUT(
        new NextRequest("http://localhost/api/admin/categories/c1", {
          method: "PUT",
          body: JSON.stringify({ name: "Updated Plowing" }),
        }),
        { params: Promise.resolve({ id: "c1" }) },
      );

      expect(mockBackendFetch).toHaveBeenCalledWith(
        "/api/v1/admin/categories/c1",
        expect.objectContaining({ method: "PUT" }),
      );
    });

    it("should return 400 for malformed JSON body", async () => {
      const response = await PUT(
        new NextRequest("http://localhost/api/admin/categories/c1", {
          method: "PUT",
          body: "{not json",
        }),
        { params: Promise.resolve({ id: "c1" }) },
      );

      expect(response.status).toBe(400);
      expect(mockBackendFetch).not.toHaveBeenCalled();
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Not Found" }, { status: 404 }),
      );

      const response = await PUT(
        new NextRequest("http://localhost/api/admin/categories/c999", {
          method: "PUT",
          body: JSON.stringify({ name: "Does not exist" }),
        }),
        { params: Promise.resolve({ id: "c999" }) },
      );

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE", () => {
    it("should delete a category and return success", async () => {
      mockBackendFetch.mockResolvedValue({ data: undefined, status: 200 });

      const response = await DELETE(
        new NextRequest("http://localhost/api/admin/categories/c1", {
          method: "DELETE",
        }),
        { params: Promise.resolve({ id: "c1" }) },
      );

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({ success: true });
    });

    it("should call the correct backend endpoint with the category id", async () => {
      mockBackendFetch.mockResolvedValue({ data: undefined, status: 200 });

      await DELETE(
        new NextRequest("http://localhost/api/admin/categories/c1", {
          method: "DELETE",
        }),
        { params: Promise.resolve({ id: "c1" }) },
      );

      expect(mockBackendFetch).toHaveBeenCalledWith(
        "/api/v1/admin/categories/c1",
        expect.objectContaining({ method: "DELETE" }),
      );
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Not Found" }, { status: 404 }),
      );

      const response = await DELETE(
        new NextRequest("http://localhost/api/admin/categories/c999", {
          method: "DELETE",
        }),
        { params: Promise.resolve({ id: "c999" }) },
      );

      expect(response.status).toBe(404);
    });
  });
});
