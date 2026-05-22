import { describe, it, expect, vi, beforeEach } from "vitest";
import { api, ApiError } from "./api";

describe("api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should make a GET request and return JSON data", async () => {
    const mockData = { id: "1", name: "Test" };
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(mockData), { status: 200 })
    );

    const result = await api("/api/test");
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith("/api/test", expect.objectContaining({
      method: "GET",
      credentials: "include",
    }));
  });

  it("should make a POST request with body", async () => {
    const body = { email: "test@example.com" };
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 })
    );

    await api("/api/test", { method: "POST", body });
    expect(fetch).toHaveBeenCalledWith("/api/test", expect.objectContaining({
      method: "POST",
      body: JSON.stringify(body),
    }));
  });

  it("should return undefined for 204 responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 204 })
    );

    const result = await api("/api/test");
    expect(result).toBeUndefined();
  });

  it("should throw ApiError on non-ok response with message", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Not Found" }), { status: 404 })
    );

    try {
      await api("/api/test");
      expect.fail("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(404);
    }
  });

  it("should handle non-JSON error responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("Server Error", { status: 500, statusText: "Internal Server Error" })
    );

    await expect(api("/api/test")).rejects.toThrow(ApiError);
  });
});

describe("ApiError", () => {
  it("should have correct name, status, and message", () => {
    const error = new ApiError(403, "Forbidden");
    expect(error.name).toBe("ApiError");
    expect(error.status).toBe(403);
    expect(error.message).toBe("Forbidden");
    expect(error).toBeInstanceOf(Error);
  });
});
