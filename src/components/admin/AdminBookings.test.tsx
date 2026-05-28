import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AdminBookings } from "./AdminBookings";
import type { Booking } from "@/types/booking";

afterEach(cleanup);

const mockBookings: Booking[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    status: "Confirmed",
    totalPrice: 240,
    areaInHectares: 4,
    createdAt: "2025-05-01T00:00:00Z",
    notes: null,
    serviceListingId: "listing-1",
    clientProfileId: "client-1",
    providerProfileId: "provider-1",
    availabilityId: "avail-1",
    availabilityStart: "2025-06-01T08:00:00Z",
    availabilityEnd: "2025-06-01T16:00:00Z",
    clientName: "Jane Doe",
    listingTitle: "Tractor Service",
    paymentStatus: null,
    paymentAmount: null,
    paymentPlatformFee: null,
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    status: "Pending",
    totalPrice: 360,
    areaInHectares: 6,
    createdAt: "2025-05-15T00:00:00Z",
    notes: "Need early start",
    serviceListingId: "listing-2",
    clientProfileId: "client-2",
    providerProfileId: "provider-2",
    availabilityId: "avail-2",
    availabilityStart: "2025-07-10T08:00:00Z",
    availabilityEnd: "2025-07-10T16:00:00Z",
    clientName: "John Smith",
    listingTitle: "Harvesting Service",
    paymentStatus: null,
    paymentAmount: null,
    paymentPlatformFee: null,
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
    expect(screen.getByText("240.00 EUR")).toBeInTheDocument();
    expect(screen.getByText("Harvesting Service")).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });
});
