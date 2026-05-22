// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";

vi.mock("@/lib/backend", () => ({
  backendFetch: vi.fn(),
  isErrorResponse: (r: unknown) => r instanceof NextResponse,
}));

import { backendFetch } from "@/lib/backend";
import { GET } from "./route";

const mockBackendFetch = vi.mocked(backendFetch);

describe("counties route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("should return county data from the backend", async () => {
      const payload = [
        { id: "1", name: "Harju" },
        { id: "2", name: "Tartu" },
      ];
      mockBackendFetch.mockResolvedValue({ data: payload, status: 200 });

      const response = await GET();

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(payload);
    });

    it("should call the backend with requireAuth false", async () => {
      mockBackendFetch.mockResolvedValue({ data: [], status: 200 });

      await GET();

      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/counties", {
        requireAuth: false,
      });
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Backend down" }, { status: 502 }),
      );

      const response = await GET();

      expect(response.status).toBe(502);
    });
  });
});
