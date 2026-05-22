import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/lib/api", () => ({
  api: vi.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));

import { api } from "@/lib/api";
import { useAuth } from "./useAuth";

const mockApi = vi.mocked(api);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return user data when me query succeeds", async () => {
    const user = {
      id: "u1",
      email: "user@test.com",
      firstName: "John",
      lastName: "Doe",
      role: "Client" as const,
    };
    mockApi.mockResolvedValue(user);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toEqual(user);
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockApi).toHaveBeenCalledWith("/api/auth/me");
  });

  it("should return null user and not authenticated when me returns null", async () => {
    mockApi.mockResolvedValue(null);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should call api with correct url and body on login", async () => {
    const authResponse = {
      user: {
        id: "u1",
        email: "a@b.com",
        firstName: "A",
        lastName: "B",
        role: "Client" as const,
      },
    };
    mockApi.mockResolvedValue(authResponse);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await result.current.login({ email: "a@b.com", password: "secret" });

    expect(mockApi).toHaveBeenCalledWith("/api/auth/login", {
      method: "POST",
      body: { email: "a@b.com", password: "secret" },
    });
  });

  it("should call api with correct url and body on register", async () => {
    const authResponse = {
      user: {
        id: "u2",
        email: "new@test.com",
        firstName: "New",
        lastName: "User",
        role: "Provider" as const,
      },
    };
    mockApi.mockResolvedValue(authResponse);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await result.current.register({
      email: "new@test.com",
      password: "pass123",
      firstName: "New",
      lastName: "User",
      role: "Provider",
    });

    expect(mockApi).toHaveBeenCalledWith("/api/auth/register", {
      method: "POST",
      body: {
        email: "new@test.com",
        password: "pass123",
        firstName: "New",
        lastName: "User",
        role: "Provider",
      },
    });
  });

  it("should call logout api endpoint", async () => {
    mockApi.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await result.current.logout();

    expect(mockApi).toHaveBeenCalledWith("/api/auth/logout", {
      method: "POST",
    });
  });
});
