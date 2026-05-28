import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AdminListings } from "./AdminListings";
import type { Listing } from "@/types/listing";

afterEach(cleanup);

const mockListings: Listing[] = [
  {
    id: "listing-1",
    title: "Plowing Service",
    categoryName: "Plowing",
    providerName: "Farm Co",
    pricePerHectare: 80,
    isActive: true,
    averageRating: 4.2,
    reviewCount: 5,
  },
  {
    id: "listing-2",
    title: "Harvesting Service",
    categoryName: "Harvesting",
    providerName: "Agro Ltd",
    pricePerHectare: 120,
    isActive: false,
    averageRating: 3.8,
    reviewCount: 2,
  },
];

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    locale: "en" as const,
    setLocale: vi.fn(),
  }),
}));

vi.mock("@/components/common/PageHeader", () => ({
  PageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("@/components/common/LoadingState", () => ({
  LoadingState: ({ label }: { label: string }) => (
    <div data-testid="loading-state">{label}</div>
  ),
}));

vi.mock("@/components/common/ErrorState", () => ({
  ErrorState: ({ message }: { message: string }) => (
    <div data-testid="error-state">{message}</div>
  ),
}));

vi.mock("@/components/common/EmptyState", () => ({
  EmptyState: ({ title }: { title: string }) => (
    <div data-testid="empty-state">{title}</div>
  ),
}));

vi.mock("@/components/common/StatusBadge", () => ({
  StatusBadge: ({ label }: { label: string }) => (
    <span data-testid="status-badge">{label}</span>
  ),
}));

vi.mock("@/components/common/ConfirmDialog", () => ({
  ConfirmDialog: ({ trigger }: { trigger: React.ReactNode }) => (
    <div data-testid="confirm-dialog">{trigger}</div>
  ),
}));

const mockUseAdminListings = vi.fn();
const mockUseDeleteListing = vi.fn();

vi.mock("@/hooks/useAdmin", () => ({
  useAdminListings: () => mockUseAdminListings(),
  useDeleteListing: () => mockUseDeleteListing(),
}));

describe("AdminListings", () => {
  beforeEach(() => {
    mockUseDeleteListing.mockReturnValue({ mutate: vi.fn(), isPending: false });
  });

  it("should render loading state when isLoading is true", () => {
    mockUseAdminListings.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    render(<AdminListings />);
    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });

  it("should render error state when error is present", () => {
    mockUseAdminListings.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Network error"),
    });
    render(<AdminListings />);
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("should render empty state when listings list is empty", () => {
    mockUseAdminListings.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    render(<AdminListings />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("should render listing rows when data is loaded", () => {
    mockUseAdminListings.mockReturnValue({
      data: mockListings,
      isLoading: false,
      error: null,
    });
    render(<AdminListings />);
    expect(screen.getByText("Plowing Service")).toBeInTheDocument();
    expect(screen.getByText("Farm Co")).toBeInTheDocument();
    expect(screen.getByText("Harvesting Service")).toBeInTheDocument();
    expect(screen.getByText("Agro Ltd")).toBeInTheDocument();
    expect(screen.getByText("80.00 EUR / ha")).toBeInTheDocument();
  });
});
