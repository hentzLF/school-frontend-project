import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/lib/api", () => ({
  api: vi.fn(),
}));

import { api } from "@/lib/api";
import {
  useAdminDashboard,
  useAdminUsers,
  useUpdateUser,
  useDeleteUser,
  useAdminBookings,
  useAdminCategories,
  useCreateCategory,
  useDeleteCategory,
  useAdminListings,
  useDeleteListing,
  useAdminPayments,
} from "./useAdmin";
import type { AdminDashboard, AdminUser } from "@/types/admin";

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

const mockDashboard: AdminDashboard = {
  totalUsers: 100,
  totalListings: 50,
  totalBookings: 200,
  totalRevenue: 9999,
  recentBookings: 10,
  activeListings: 30,
};

const mockUser: AdminUser = {
  id: "u1",
  email: "admin@test.com",
  firstName: "Admin",
  lastName: "User",
  role: "Admin",
  createdAt: "2026-01-01T00:00:00Z",
  isActive: true,
};

describe("useAdminDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch admin dashboard data", async () => {
    mockApi.mockResolvedValue(mockDashboard);

    const { result } = renderHook(() => useAdminDashboard(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockDashboard);
    expect(mockApi).toHaveBeenCalledWith("/api/admin/dashboard");
  });
});

describe("useAdminUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch admin users list", async () => {
    mockApi.mockResolvedValue([mockUser]);

    const { result } = renderHook(() => useAdminUsers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([mockUser]);
    expect(mockApi).toHaveBeenCalledWith("/api/admin/users");
  });
});

describe("useUpdateUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call api with PUT and new role", async () => {
    mockApi.mockResolvedValue({ ...mockUser, role: "Provider" });

    const { result } = renderHook(() => useUpdateUser(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({ id: "u1", role: "Provider" });

    expect(mockApi).toHaveBeenCalledWith("/api/admin/users/u1", {
      method: "PUT",
      body: { role: "Provider" },
    });
  });
});

describe("useDeleteUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call api with DELETE for the given user id", async () => {
    mockApi.mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync("u1");

    expect(mockApi).toHaveBeenCalledWith("/api/admin/users/u1", {
      method: "DELETE",
    });
  });
});

describe("useAdminBookings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch admin bookings list", async () => {
    mockApi.mockResolvedValue([]);

    const { result } = renderHook(() => useAdminBookings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi).toHaveBeenCalledWith("/api/admin/bookings");
  });
});

describe("useAdminCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch admin categories list", async () => {
    mockApi.mockResolvedValue([{ id: "cat1", name: "Plowing" }]);

    const { result } = renderHook(() => useAdminCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi).toHaveBeenCalledWith("/api/admin/categories");
  });
});

describe("useCreateCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call api with POST and category data", async () => {
    mockApi.mockResolvedValue({ id: "cat1", name: "Plowing" });

    const { result } = renderHook(() => useCreateCategory(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({ name: "Plowing", description: "Field plowing services" });

    expect(mockApi).toHaveBeenCalledWith("/api/admin/categories", {
      method: "POST",
      body: { name: "Plowing", description: "Field plowing services" },
    });
  });
});

describe("useDeleteCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call api with DELETE for the given category id", async () => {
    mockApi.mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteCategory(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync("cat1");

    expect(mockApi).toHaveBeenCalledWith("/api/admin/categories/cat1", {
      method: "DELETE",
    });
  });
});

describe("useAdminListings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch admin listings list", async () => {
    mockApi.mockResolvedValue([]);

    const { result } = renderHook(() => useAdminListings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi).toHaveBeenCalledWith("/api/admin/listings");
  });
});

describe("useDeleteListing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call api with DELETE for the given listing id", async () => {
    mockApi.mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteListing(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync("l1");

    expect(mockApi).toHaveBeenCalledWith("/api/admin/listings/l1", {
      method: "DELETE",
    });
  });
});

describe("useAdminPayments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch admin payments list", async () => {
    mockApi.mockResolvedValue([]);

    const { result } = renderHook(() => useAdminPayments(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi).toHaveBeenCalledWith("/api/admin/payments");
  });
});
