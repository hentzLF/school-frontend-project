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

describe("equipment [id] route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("PUT", () => {
    it("should update equipment and return updated data", async () => {
      const payload = { id: "1", name: "Updated tractor" };
      mockBackendFetch.mockResolvedValue({ data: payload, status: 200 });

      const body = {
        name: "Updated tractor",
        description: "Updated desc",
        condition: "Excellent",
      };
      const response = await PUT(
        new NextRequest("http://localhost/api/equipment/1", {
          method: "PUT",
          body: JSON.stringify(body),
        }),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(200);
      expect(mockBackendFetch).toHaveBeenCalledWith(
        "/api/v1/provider/equipment/1",
        expect.objectContaining({ method: "PUT", body }),
      );
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Backend down" }, { status: 502 }),
      );

      const response = await PUT(
        new NextRequest("http://localhost/api/equipment/1", {
          method: "PUT",
          body: JSON.stringify({ name: "x" }),
        }),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(502);
    });

    it("should return 400 for malformed JSON body", async () => {
      const response = await PUT(
        new NextRequest("http://localhost/api/equipment/1", {
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
    it("should delete equipment and return success", async () => {
      mockBackendFetch.mockResolvedValue({ data: undefined, status: 200 });

      const response = await DELETE(
        new NextRequest("http://localhost/api/equipment/1", {
          method: "DELETE",
        }),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({ success: true });
      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/provider/equipment/1", {
        method: "DELETE",
      });
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Backend down" }, { status: 502 }),
      );

      const response = await DELETE(
        new NextRequest("http://localhost/api/equipment/1", {
          method: "DELETE",
        }),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(502);
    });

    it("should use the id from route params in the backend path", async () => {
      mockBackendFetch.mockResolvedValue({ data: undefined, status: 200 });

      await DELETE(
        new NextRequest("http://localhost/api/equipment/7", {
          method: "DELETE",
        }),
        { params: Promise.resolve({ id: "7" }) },
      );

      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/provider/equipment/7", {
        method: "DELETE",
      });
    });
  });
});
