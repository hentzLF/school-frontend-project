import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/lib/api", () => ({
  api: vi.fn(),
}));

import { api } from "@/lib/api";
import {
  useListings,
  useListing,
  useCounties,
  useCategories,
} from "./useListings";

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
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

describe("useListings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch listings and return data", async () => {
    const data = { items: [{ id: "1" }], total: 1, page: 1, pageSize: 20 };
    mockApi.mockResolvedValue(data);

    const { result } = renderHook(() => useListings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
    expect(mockApi).toHaveBeenCalledWith("/api/listings", { redirectOn401: false });
  });

  it("should append filters as query parameters", async () => {
    mockApi.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 20 });

    const { result } = renderHook(
      () => useListings({ search: "tractor", page: 2 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi).toHaveBeenCalledWith("/api/listings?search=tractor&page=2", { redirectOn401: false });
  });
});

describe("useListing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch a single listing by id", async () => {
    mockApi.mockResolvedValue({ id: "1", title: "Tractor" });

    const { result } = renderHook(() => useListing("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi).toHaveBeenCalledWith("/api/listings/1", { redirectOn401: false });
  });

  it("should stay idle when no id is provided", () => {
    const { result } = renderHook(() => useListing(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useCounties", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch the list of counties", async () => {
    mockApi.mockResolvedValue([{ id: "c1", name: "Harju" }]);

    const { result } = renderHook(() => useCounties(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi).toHaveBeenCalledWith("/api/counties");
  });
});

describe("useCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch the list of categories", async () => {
    mockApi.mockResolvedValue([{ id: "cat1", name: "Plowing" }]);

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi).toHaveBeenCalledWith("/api/categories");
  });
});
