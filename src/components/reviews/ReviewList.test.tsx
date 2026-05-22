import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ReviewList } from "./ReviewList";
import type { Review } from "@/types/review";

afterEach(cleanup);

vi.mock("@/hooks/useReviews", () => ({
  useReviews: vi.fn(),
  useDeleteReview: () => ({ mutate: vi.fn() }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "user-1", email: "test@test.com", firstName: "Test", lastName: "User", role: "Client" },
    logout: vi.fn(),
    login: vi.fn(),
    loginError: null,
    isLoginPending: false,
    isLoading: false,
    isAuthenticated: true,
    register: vi.fn(),
    registerError: null,
    isRegisterPending: false,
  }),
}));

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "common.loading": "Loading...",
        "reviews.loadError": "Failed to load reviews",
        "reviews.title": "My Reviews",
        "reviews.noReviews": "No reviews yet",
        "common.delete": "Delete",
      };
      return map[key] ?? key;
    },
    locale: "en" as const,
    setLocale: vi.fn(),
  }),
}));

const mockReview: Review = {
  id: "rev-1",
  listingId: "listing-1",
  listingTitle: "Tractor Service",
  reviewerId: "reviewer-1",
  reviewerName: "Jane Doe",
  rating: 4,
  comment: "Great service, highly recommend!",
  createdAt: "2026-05-01T00:00:00Z",
  updatedAt: "2026-05-01T00:00:00Z",
};

describe("ReviewList", () => {
  it("should render loading state", async () => {
    const { useReviews } = await import("@/hooks/useReviews");
    vi.mocked(useReviews).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as ReturnType<typeof useReviews>);

    render(<ReviewList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render error state", async () => {
    const { useReviews } = await import("@/hooks/useReviews");
    vi.mocked(useReviews).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Network error"),
    } as ReturnType<typeof useReviews>);

    render(<ReviewList />);
    expect(screen.getByText("Failed to load reviews")).toBeInTheDocument();
  });

  it("should render empty state when no reviews", async () => {
    const { useReviews } = await import("@/hooks/useReviews");
    vi.mocked(useReviews).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as ReturnType<typeof useReviews>);

    render(<ReviewList />);
    expect(screen.getByText("No reviews yet")).toBeInTheDocument();
  });

  it("should render review with reviewer name and comment", async () => {
    const { useReviews } = await import("@/hooks/useReviews");
    vi.mocked(useReviews).mockReturnValue({
      data: [mockReview],
      isLoading: false,
      error: null,
    } as ReturnType<typeof useReviews>);

    render(<ReviewList />);
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Great service, highly recommend!")).toBeInTheDocument();
  });

  it("should show listing title when no listingId prop", async () => {
    const { useReviews } = await import("@/hooks/useReviews");
    vi.mocked(useReviews).mockReturnValue({
      data: [mockReview],
      isLoading: false,
      error: null,
    } as ReturnType<typeof useReviews>);

    render(<ReviewList />);
    expect(screen.getByText("Tractor Service")).toBeInTheDocument();
  });
});
