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

const mockCategories = [
  { id: "c1", name: "Plowing", description: "Plowing services" },
  { id: "c2", name: "Irrigation", description: "Irrigation services" },
];

describe("admin/categories route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("should return all categories from the backend", async () => {
      mockBackendFetch.mockResolvedValue({ data: mockCategories, status: 200 });

      const response = await GET();

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(mockCategories);
    });

    it("should call the correct backend endpoint", async () => {
      mockBackendFetch.mockResolvedValue({ data: mockCategories, status: 200 });

      await GET();

      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/admin/categories");
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      );

      const response = await GET();

      expect(response.status).toBe(401);
    });
  });

  describe("POST", () => {
    const validBody = { name: "Harvesting", description: "Crop harvesting" };

    it("should create a category with valid input", async () => {
      const created = { id: "c3", ...validBody };
      mockBackendFetch.mockResolvedValue({ data: created, status: 201 });

      const response = await POST(
        new NextRequest("http://localhost/api/admin/categories", {
          method: "POST",
          body: JSON.stringify(validBody),
        }),
      );

      expect(response.status).toBe(201);
      await expect(response.json()).resolves.toEqual(created);
      expect(mockBackendFetch).toHaveBeenCalledWith(
        "/api/v1/admin/categories",
        expect.objectContaining({ method: "POST", body: validBody }),
      );
    });

    it("should reject an empty name with 400", async () => {
      const response = await POST(
        new NextRequest("http://localhost/api/admin/categories", {
          method: "POST",
          body: JSON.stringify({ name: "" }),
        }),
      );

      expect(response.status).toBe(400);
      expect(mockBackendFetch).not.toHaveBeenCalled();
    });

    it("should reject a malformed JSON body with 400", async () => {
      const response = await POST(
        new NextRequest("http://localhost/api/admin/categories", {
          method: "POST",
          body: "{not json",
        }),
      );

      expect(response.status).toBe(400);
      expect(mockBackendFetch).not.toHaveBeenCalled();
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Conflict" }, { status: 409 }),
      );

      const response = await POST(
        new NextRequest("http://localhost/api/admin/categories", {
          method: "POST",
          body: JSON.stringify(validBody),
        }),
      );

      expect(response.status).toBe(409);
    });
  });
});
