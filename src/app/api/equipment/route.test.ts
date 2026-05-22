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

describe("equipment route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("should return equipment data from the backend", async () => {
      const payload = [{ id: "1", name: "John Deere 6120M" }];
      mockBackendFetch.mockResolvedValue({ data: payload, status: 200 });

      const response = await GET();

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(payload);
      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/equipment");
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Backend down" }, { status: 502 }),
      );

      const response = await GET();

      expect(response.status).toBe(502);
    });

    it("should call the correct backend path", async () => {
      mockBackendFetch.mockResolvedValue({ data: [], status: 200 });

      await GET();

      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/equipment");
    });
  });

  describe("POST", () => {
    const validBody = {
      name: "John Deere 6120M",
      description: "Powerful tractor for field work",
      condition: "Good",
    };

    it("should create equipment with valid input", async () => {
      mockBackendFetch.mockResolvedValue({
        data: { id: "1", ...validBody },
        status: 201,
      });

      const response = await POST(
        new NextRequest("http://localhost/api/equipment", {
          method: "POST",
          body: JSON.stringify(validBody),
        }),
      );

      expect(response.status).toBe(201);
      expect(mockBackendFetch).toHaveBeenCalledWith(
        "/api/v1/equipment",
        expect.objectContaining({ method: "POST", body: validBody }),
      );
    });

    it("should reject invalid input with 400", async () => {
      const response = await POST(
        new NextRequest("http://localhost/api/equipment", {
          method: "POST",
          body: JSON.stringify({ name: "" }),
        }),
      );

      expect(response.status).toBe(400);
      expect(mockBackendFetch).not.toHaveBeenCalled();
    });

    it("should reject malformed JSON body with 400", async () => {
      const response = await POST(
        new NextRequest("http://localhost/api/equipment", {
          method: "POST",
          body: "{not json",
        }),
      );

      expect(response.status).toBe(400);
      expect(mockBackendFetch).not.toHaveBeenCalled();
    });
  });
});
