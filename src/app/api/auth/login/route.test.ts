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
  return new NextRequest("http://localhost/api/auth/login", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const authData = {
  token: "access-token",
  refreshToken: "refresh-token",
  user: {
    id: "u1",
    email: "a@b.com",
    firstName: "A",
    lastName: "B",
    role: "Client",
  },
};

describe("auth/login route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should log in with valid credentials and set auth cookies", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ accessToken: authData.token }), {
        status: 200,
        headers: {
          "Set-Cookie":
            `refreshToken=${authData.refreshToken}; Path=/api/v1/auth; HttpOnly`,
        },
      }),
    );

    const response = await POST(
      postRequest({ email: "a@b.com", password: "secret" }),
    );

    expect(response.status).toBe(200);
    expect(mockSetAuthCookies).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        token: authData.token,
        refreshToken: authData.refreshToken,
      }),
    );
  });

  it("should reject an invalid email with 400", async () => {
    const response = await POST(
      postRequest({ email: "not-an-email", password: "secret" }),
    );

    expect(response.status).toBe(400);
    expect(mockSetAuthCookies).not.toHaveBeenCalled();
  });

  it("should reject a malformed JSON body with 400", async () => {
    const response = await POST(postRequest("{not json"));
    expect(response.status).toBe(400);
  });

  it("should propagate backend authentication failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
      }),
    );

    const response = await POST(
      postRequest({ email: "a@b.com", password: "wrong" }),
    );

    expect(response.status).toBe(401);
    expect(mockSetAuthCookies).not.toHaveBeenCalled();
  });

  it("should return 502 when the auth service is unreachable", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network"));

    const response = await POST(
      postRequest({ email: "a@b.com", password: "secret" }),
    );

    expect(response.status).toBe(502);
  });
});
