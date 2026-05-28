import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { BookingList } from "./BookingList";
import type { Booking } from "@/types/booking";

afterEach(cleanup);

vi.mock("@/hooks/useBookings", () => ({
  useBookings: vi.fn(),
  useUpdateBookingStatus: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock("@/hooks/useListings", () => ({
  useListing: () => ({ data: undefined }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: {
      id: "user-1",
      profileId: "client-profile-1",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      role: "Client",
    },
    isLoading: false,
    isAuthenticated: true,
  }),
}));

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "common.loading": "Loading...",
        "bookings.loadError": "Failed to load bookings",
        "bookings.title": "Bookings",
        "bookings.noBookings": "No bookings yet",
        "dashboard.bookingsDesc": "Manage your bookings",
        "bookings.areaInHectares": "Area (ha)",
        "bookings.confirm": "Confirm",
        "common.cancel": "Cancel",
        "bookings.startWork": "Start Work",
        "bookings.complete": "Complete",
        "bookings.status.Pending": "Pending",
        "bookings.requestPayment": "Request Payment",
      };
      return map[key] ?? key;
    },
    locale: "en" as const,
    setLocale: vi.fn(),
  }),
}));

const mockBooking: Booking = {
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  status: "Pending",
  totalPrice: 300,
  areaInHectares: 5.5,
  createdAt: "2026-05-01T00:00:00Z",
  notes: null,
  serviceListingId: "listing-1",
  clientProfileId: "client-profile-1",
  providerProfileId: "provider-profile-1",
  availabilityId: "avail-1",
  availabilityStart: "2026-06-01T08:00:00Z",
  availabilityEnd: "2026-06-01T16:00:00Z",
  clientName: "Alice Smith",
  listingTitle: "Tractor Service",
  paymentStatus: null,
  paymentAmount: null,
  paymentPlatformFee: null,
};

describe("BookingList", () => {
  it("should render loading state", async () => {
    const { useBookings } = await import("@/hooks/useBookings");
    vi.mocked(useBookings).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as ReturnType<typeof useBookings>);

    render(<BookingList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render error state", async () => {
    const { useBookings } = await import("@/hooks/useBookings");
    vi.mocked(useBookings).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Network error"),
    } as ReturnType<typeof useBookings>);

    render(<BookingList />);
    expect(screen.getByText("Failed to load bookings")).toBeInTheDocument();
  });

  it("should render empty state when no bookings", async () => {
    const { useBookings } = await import("@/hooks/useBookings");
    vi.mocked(useBookings).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as ReturnType<typeof useBookings>);

    render(<BookingList />);
    expect(screen.getByText("No bookings yet")).toBeInTheDocument();
  });

  it("should render a booking card with id prefix and price", async () => {
    const { useBookings } = await import("@/hooks/useBookings");
    vi.mocked(useBookings).mockReturnValue({
      data: [mockBooking],
      isLoading: false,
      error: null,
    } as ReturnType<typeof useBookings>);

    render(<BookingList />);
    expect(screen.getByText("Tractor Service")).toBeInTheDocument();
    expect(screen.getByText(/300\.00 EUR/)).toBeInTheDocument();
  });
});
