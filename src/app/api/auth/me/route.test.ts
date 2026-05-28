// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth", () => ({
  getToken: vi.fn(),
}));

import { getToken } from "@/lib/auth";
import { GET } from "./route";

const mockGetToken = vi.mocked(getToken);

function makeJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256" })).toString(
    "base64url",
  );
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${header}.${body}.signature`;
}

describe("auth/me route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return user info decoded from the JWT", async () => {
    mockGetToken.mockResolvedValue(
      makeJwt({
        sub: "user-id-123",
        given_name: "John",
        family_name: "Doe",
        role: "Client",
      }),
    );

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      id: "user-id-123",
      firstName: "John",
      lastName: "Doe",
      role: "Client",
    });
  });

  it("should return 401 when no token is present", async () => {
    mockGetToken.mockResolvedValue(undefined);

    const response = await GET();

    expect(response.status).toBe(401);
  });

  it("should return 401 for a malformed token", async () => {
    mockGetToken.mockResolvedValue("not.a.jwt");

    const response = await GET();

    expect(response.status).toBe(401);
  });

  it("should handle an array role claim", async () => {
    mockGetToken.mockResolvedValue(
      makeJwt({
        sub: "u2",
        given_name: "Jane",
        family_name: "Smith",
        role: ["Admin", "Client"],
      }),
    );

    const response = await GET();
    const body = await response.json();

    expect(body.role).toBe("Admin");
  });
});
