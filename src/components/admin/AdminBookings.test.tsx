import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AdminBookings } from "./AdminBookings";
import type { Booking } from "@/types/booking";

afterEach(cleanup);

const mockBookings: Booking[] = [
  {
    id: "booking-1",
    listingId: "listing-1",
    listingTitle: "Tractor Service",
    clientId: "client-1",
    clientName: "Jane Doe",
    providerId: "prov-1",
    providerName: "Farm Co",
    status: "Confirmed",
    startDate: "2025-06-01T00:00:00Z",
    endDate: "2025-06-03T00:00:00Z",
    totalPrice: 240,
    notes: null,
    createdAt: "2025-05-01T00:00:00Z",
    updatedAt: "2025-05-01T00:00:00Z",
  },
  {
    id: "booking-2",
    listingId: "listing-2",
    listingTitle: "Harvesting Service",
    clientId: "client-2",
    clientName: "John Smith",
    providerId: "prov-2",
    providerName: "Agro Ltd",
    status: "Pending",
    startDate: "2025-07-10T00:00:00Z",
    endDate: "2025-07-12T00:00:00Z",
    totalPrice: 360,
    notes: "Need early start",
    createdAt: "2025-05-15T00:00:00Z",
    updatedAt: "2025-05-15T00:00:00Z",
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

const mockUseAdminBookings = vi.fn();

vi.mock("@/hooks/useAdmin", () => ({
  useAdminBookings: () => mockUseAdminBookings(),
}));

describe("AdminBookings", () => {
  it("should render loading state when isLoading is true", () => {
    mockUseAdminBookings.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    render(<AdminBookings />);
    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });

  it("should render error state when error is present", () => {
    mockUseAdminBookings.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Network error"),
    });
    render(<AdminBookings />);
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  it("should render empty state when bookings list is empty", () => {
    mockUseAdminBookings.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    render(<AdminBookings />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("should render booking rows when data is loaded", () => {
    mockUseAdminBookings.mockReturnValue({
      data: mockBookings,
      isLoading: false,
      error: null,
    });
    render(<AdminBookings />);
    expect(screen.getByText("Tractor Service")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Farm Co")).toBeInTheDocument();
    expect(screen.getByText("240.00 EUR")).toBeInTheDocument();
    expect(screen.getByText("Harvesting Service")).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });
});
