import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/lib/api", () => ({
  api: vi.fn(),
}));

import { api } from "@/lib/api";
import { useReviews, useCreateReview, useDeleteReview } from "./useReviews";
import type { Review } from "@/types/review";

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

const mockReview: Review = {
  id: "rev1",
  listingId: "l1",
  listingTitle: "Tractor Service",
  reviewerId: "u1",
  reviewerName: "Alice",
  rating: 5,
  comment: "Excellent service!",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

describe("useReviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch all reviews without filter", async () => {
    mockApi.mockResolvedValue([mockReview]);

    const { result } = renderHook(() => useReviews(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([mockReview]);
    expect(mockApi).toHaveBeenCalledWith("/api/reviews");
  });

  it("should append listingId as query parameter when provided", async () => {
    mockApi.mockResolvedValue([mockReview]);

    const { result } = renderHook(() => useReviews("l1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi).toHaveBeenCalledWith("/api/reviews?listingId=l1");
  });
});

describe("useCreateReview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call api with POST and review data", async () => {
    mockApi.mockResolvedValue(mockReview);

    const { result } = renderHook(() => useCreateReview(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      listingId: "l1",
      rating: 5,
      comment: "Excellent service!",
    });

    expect(mockApi).toHaveBeenCalledWith("/api/reviews", {
      method: "POST",
      body: { listingId: "l1", rating: 5, comment: "Excellent service!" },
    });
  });
});

describe("useDeleteReview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call api with DELETE for the given review id", async () => {
    mockApi.mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteReview(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync("rev1");

    expect(mockApi).toHaveBeenCalledWith("/api/reviews/rev1", {
      method: "DELETE",
    });
  });
});
