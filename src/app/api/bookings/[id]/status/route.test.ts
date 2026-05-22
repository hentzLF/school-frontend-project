// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

vi.mock("@/lib/backend", () => ({
  backendFetch: vi.fn(),
  isErrorResponse: (r: unknown) => r instanceof NextResponse,
}));

import { backendFetch } from "@/lib/backend";
import { PUT } from "./route";

const mockBackendFetch = vi.mocked(backendFetch);

describe("bookings [id] status route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("PUT", () => {
    const validBody = { status: "Confirmed" as const };

    it("should update booking status with valid input", async () => {
      const payload = { id: "1", status: "Confirmed" };
      mockBackendFetch.mockResolvedValue({ data: payload, status: 200 });

      const response = await PUT(
        new NextRequest("http://localhost/api/bookings/1/status", {
          method: "PUT",
          body: JSON.stringify(validBody),
        }),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(payload);
      expect(mockBackendFetch).toHaveBeenCalledWith(
        "/api/v1/bookings/1/status",
        expect.objectContaining({ method: "PUT", body: validBody }),
      );
    });

    it("should reject invalid status value with 400", async () => {
      const response = await PUT(
        new NextRequest("http://localhost/api/bookings/1/status", {
          method: "PUT",
          body: JSON.stringify({ status: "InvalidStatus" }),
        }),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(400);
      expect(mockBackendFetch).not.toHaveBeenCalled();
    });

    it("should reject malformed JSON body with 400", async () => {
      const response = await PUT(
        new NextRequest("http://localhost/api/bookings/1/status", {
          method: "PUT",
          body: "{not json",
        }),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(400);
      expect(mockBackendFetch).not.toHaveBeenCalled();
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Backend down" }, { status: 502 }),
      );

      const response = await PUT(
        new NextRequest("http://localhost/api/bookings/1/status", {
          method: "PUT",
          body: JSON.stringify(validBody),
        }),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(502);
    });
  });
});
