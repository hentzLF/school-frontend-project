// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

vi.mock("@/lib/backend", () => ({
  backendFetch: vi.fn(),
  isErrorResponse: (r: unknown) => r instanceof NextResponse,
}));

import { backendFetch } from "@/lib/backend";
import { GET } from "./route";

const mockBackendFetch = vi.mocked(backendFetch);

describe("conversations [id] route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("should return a single conversation from the backend", async () => {
      const payload = { id: "1", participantId: "user-2" };
      mockBackendFetch.mockResolvedValue({ data: payload, status: 200 });

      const response = await GET(
        new NextRequest("http://localhost/api/conversations/1"),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(payload);
      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/conversations/1");
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Backend down" }, { status: 502 }),
      );

      const response = await GET(
        new NextRequest("http://localhost/api/conversations/99"),
        { params: Promise.resolve({ id: "99" }) },
      );

      expect(response.status).toBe(502);
    });

    it("should use the id from route params in the backend path", async () => {
      mockBackendFetch.mockResolvedValue({ data: {}, status: 200 });

      await GET(new NextRequest("http://localhost/api/conversations/42"), {
        params: Promise.resolve({ id: "42" }),
      });

      expect(mockBackendFetch).toHaveBeenCalledWith("/api/v1/conversations/42");
    });
  });
});
