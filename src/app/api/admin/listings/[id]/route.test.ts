// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

vi.mock("@/lib/backend", () => ({
  backendFetch: vi.fn(),
  isErrorResponse: (r: unknown) => r instanceof NextResponse,
}));

import { backendFetch } from "@/lib/backend";
import { DELETE } from "./route";

const mockBackendFetch = vi.mocked(backendFetch);

describe("admin/listings/[id] route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("DELETE", () => {
    it("should delete a listing and return success", async () => {
      mockBackendFetch.mockResolvedValue({ data: undefined, status: 200 });

      const response = await DELETE(
        new NextRequest("http://localhost/api/admin/listings/l1", {
          method: "DELETE",
        }),
        { params: Promise.resolve({ id: "l1" }) },
      );

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({ success: true });
    });

    it("should call the correct backend endpoint with the listing id", async () => {
      mockBackendFetch.mockResolvedValue({ data: undefined, status: 200 });

      await DELETE(
        new NextRequest("http://localhost/api/admin/listings/l1", {
          method: "DELETE",
        }),
        { params: Promise.resolve({ id: "l1" }) },
      );

      expect(mockBackendFetch).toHaveBeenCalledWith(
        "/api/v1/admin/listings/l1",
        expect.objectContaining({ method: "DELETE" }),
      );
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Not Found" }, { status: 404 }),
      );

      const response = await DELETE(
        new NextRequest("http://localhost/api/admin/listings/l999", {
          method: "DELETE",
        }),
        { params: Promise.resolve({ id: "l999" }) },
      );

      expect(response.status).toBe(404);
    });

    it("should propagate a 403 forbidden response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      );

      const response = await DELETE(
        new NextRequest("http://localhost/api/admin/listings/l1", {
          method: "DELETE",
        }),
        { params: Promise.resolve({ id: "l1" }) },
      );

      expect(response.status).toBe(403);
    });
  });
});
