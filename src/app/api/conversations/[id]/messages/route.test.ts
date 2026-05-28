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

describe("conversations [id] messages route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("should return messages from the conversation detail response", async () => {
      const messages = [
        { id: "msg-1", content: "Hello!", conversationId: "1" },
      ];
      mockBackendFetch.mockResolvedValue({
        data: { messages: { items: messages } },
        status: 200,
      });

      const response = await GET(
        new NextRequest("http://localhost/api/conversations/1/messages"),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(messages);
      expect(mockBackendFetch).toHaveBeenCalledWith(
        "/api/v1/conversations/1",
      );
    });

    it("should return empty array when messages items is null", async () => {
      mockBackendFetch.mockResolvedValue({
        data: { messages: { items: null } },
        status: 200,
      });

      const response = await GET(
        new NextRequest("http://localhost/api/conversations/1/messages"),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual([]);
    });

    it("should propagate a backend error response", async () => {
      mockBackendFetch.mockResolvedValue(
        NextResponse.json({ error: "Backend down" }, { status: 502 }),
      );

      const response = await GET(
        new NextRequest("http://localhost/api/conversations/1/messages"),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(502);
    });

    it("should use the id from route params in the backend path", async () => {
      mockBackendFetch.mockResolvedValue({
        data: { messages: { items: [] } },
        status: 200,
      });

      await GET(
        new NextRequest("http://localhost/api/conversations/42/messages"),
        { params: Promise.resolve({ id: "42" }) },
      );

      expect(mockBackendFetch).toHaveBeenCalledWith(
        "/api/v1/conversations/42",
      );
    });
  });

  describe("POST", () => {
    const validBody = { content: "Is the tractor still available?" };

    it("should send a message with valid input", async () => {
      const payload = { id: "msg-2", content: validBody.content };
      mockBackendFetch.mockResolvedValue({ data: payload, status: 201 });

      const response = await POST(
        new NextRequest("http://localhost/api/conversations/1/messages", {
          method: "POST",
          body: JSON.stringify(validBody),
        }),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(201);
      expect(mockBackendFetch).toHaveBeenCalledWith(
        "/api/v1/conversations/1/messages",
        expect.objectContaining({ method: "POST", body: validBody }),
      );
    });

    it("should reject invalid input with 400", async () => {
      const response = await POST(
        new NextRequest("http://localhost/api/conversations/1/messages", {
          method: "POST",
          body: JSON.stringify({ content: "" }),
        }),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(400);
      expect(mockBackendFetch).not.toHaveBeenCalled();
    });

    it("should reject malformed JSON body with 400", async () => {
      const response = await POST(
        new NextRequest("http://localhost/api/conversations/1/messages", {
          method: "POST",
          body: "{not json",
        }),
        { params: Promise.resolve({ id: "1" }) },
      );

      expect(response.status).toBe(400);
      expect(mockBackendFetch).not.toHaveBeenCalled();
    });
  });
});
