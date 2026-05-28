import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ListingList } from "./ListingList";
import type { Listing } from "@/types/listing";

afterEach(cleanup);

vi.mock("@/hooks/useListings", () => ({
  useListings: vi.fn(),
  useCategories: () => ({ data: [] }),
  useCounties: () => ({ data: [] }),
}));

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "common.loading": "Loading...",
        "listings.loadError": "Failed to load listings",
        "listings.title": "Listings",
        "listings.noListings": "No listings found",
        "dashboard.listingsDesc": "Browse available services",
        "listings.createListing": "Create Listing",
        "listings.searchPlaceholder": "Search...",
        "listings.allCategories": "All Categories",
        "listings.allCounties": "All Counties",
        "listings.category": "Category",
        "listings.county": "County",
        "common.search": "Search",
        "common.previous": "Previous",
        "common.next": "Next",
        "common.page": "Page",
        "common.of": "of",
      };
      return map[key] ?? key;
    },
    locale: "en" as const,
    setLocale: vi.fn(),
  }),
}));

const mockListing: Listing = {
  id: "listing-1",
  title: "Tractor Service",
  categoryName: "Plowing",
  providerName: "John Farmer",
  pricePerHectare: 50,
  isActive: true,
  averageRating: 4.0,
  reviewCount: 3,
};

describe("ListingList", () => {
  it("should render loading state", async () => {
    const { useListings } = await import("@/hooks/useListings");
    vi.mocked(useListings).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as ReturnType<typeof useListings>);

    render(<ListingList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render error state", async () => {
    const { useListings } = await import("@/hooks/useListings");
    vi.mocked(useListings).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Network error"),
    } as ReturnType<typeof useListings>);

    render(<ListingList />);
    expect(screen.getByText("Failed to load listings")).toBeInTheDocument();
  });

  it("should render empty state when no listings", async () => {
    const { useListings } = await import("@/hooks/useListings");
    vi.mocked(useListings).mockReturnValue({
      data: { items: [], totalPages: 0, totalCount: 0 },
      isLoading: false,
      error: null,
    } as ReturnType<typeof useListings>);

    render(<ListingList />);
    expect(screen.getByText("No listings found")).toBeInTheDocument();
  });

  it("should render listing cards when data is available", async () => {
    const { useListings } = await import("@/hooks/useListings");
    vi.mocked(useListings).mockReturnValue({
      data: { items: [mockListing], totalPages: 1, totalCount: 1 },
      isLoading: false,
      error: null,
    } as ReturnType<typeof useListings>);

    render(<ListingList />);
    expect(screen.getByText("Tractor Service")).toBeInTheDocument();
  });

  it("should render create listing button", async () => {
    const { useListings } = await import("@/hooks/useListings");
    vi.mocked(useListings).mockReturnValue({
      data: { items: [], totalPages: 0, totalCount: 0 },
      isLoading: false,
      error: null,
    } as ReturnType<typeof useListings>);

    render(<ListingList />);
    expect(screen.getByText("Create Listing")).toBeInTheDocument();
  });
});
