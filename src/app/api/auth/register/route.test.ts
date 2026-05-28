// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/auth", () => ({
  setAuthCookies: vi.fn(),
  setAuthCookiesOnResponse: vi.fn(),
}));

import { setAuthCookiesOnResponse } from "@/lib/auth";
import { POST } from "./route";

const mockSetAuthCookies = vi.mocked(setAuthCookiesOnResponse);

function postRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/auth/register", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const validBody = {
  email: "farmer@example.com",
  password: "secret123",
  firstName: "John",
  lastName: "Doe",
};

const authData = {
  token: "access-token",
  refreshToken: "refresh-token",
  user: {
    id: "u1",
    email: "farmer@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "Client",
  },
};

describe("auth/register route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("should register with valid credentials and set auth cookies", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(authData), { status: 200 }),
    );

    const response = await POST(postRequest(validBody));

    expect(response.status).toBe(201);
    expect(mockSetAuthCookies).toHaveBeenCalledWith(expect.anything(), authData);
    await expect(response.json()).resolves.toEqual({ user: authData.user });
  });

  it("should reject an invalid email with 400", async () => {
    const response = await POST(
      postRequest({ ...validBody, email: "not-an-email" }),
    );

    expect(response.status).toBe(400);
    expect(mockSetAuthCookies).not.toHaveBeenCalled();
  });

  it("should reject a missing required field with 400", async () => {
    const response = await POST(
      postRequest({ email: "a@b.com", password: "secret" }),
    );

    expect(response.status).toBe(400);
    expect(mockSetAuthCookies).not.toHaveBeenCalled();
  });

  it("should reject a malformed JSON body with 400", async () => {
    const response = await POST(postRequest("{not json"));
    expect(response.status).toBe(400);
  });

  it("should propagate backend registration failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Email already exists" }), {
        status: 409,
      }),
    );

    const response = await POST(postRequest(validBody));

    expect(response.status).toBe(409);
    expect(mockSetAuthCookies).not.toHaveBeenCalled();
  });

  it("should return 502 when the auth service is unreachable", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network"));

    const response = await POST(postRequest(validBody));

    expect(response.status).toBe(502);
  });

  it("should return 500 when BACKEND_URL is not set", async () => {
    vi.stubEnv("BACKEND_URL", "");

    const response = await POST(postRequest(validBody));

    expect(response.status).toBe(500);
  });
});
