import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { BookingList } from "./BookingList";
import type { Booking } from "@/types/booking";

afterEach(cleanup);

vi.mock("@/hooks/useBookings", () => ({
  useBookings: vi.fn(),
  useUpdateBookingStatus: () => ({ mutate: vi.fn() }),
}));

vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "common.loading": "Loading...",
        "bookings.loadError": "Failed to load bookings",
        "bookings.title": "My Bookings",
        "bookings.noBookings": "No bookings yet",
        "dashboard.bookingsDesc": "Manage your bookings",
        "bookings.client": "Client",
        "bookings.provider": "Provider",
        "bookings.confirm": "Confirm",
        "common.cancel": "Cancel",
        "bookings.startWork": "Start Work",
        "bookings.complete": "Complete",
      };
      return map[key] ?? key;
    },
    locale: "en" as const,
    setLocale: vi.fn(),
  }),
}));

const mockBooking: Booking = {
  id: "booking-1",
  listingId: "listing-1",
  listingTitle: "Tractor Service",
  clientId: "client-1",
  clientName: "Alice Smith",
  providerId: "provider-1",
  providerName: "Bob Farmer",
  status: "Pending",
  startDate: "2026-06-01T00:00:00Z",
  endDate: "2026-06-03T00:00:00Z",
  totalPrice: 300,
  notes: null,
  createdAt: "2026-05-01T00:00:00Z",
  updatedAt: "2026-05-01T00:00:00Z",
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

  it("should render a booking card with listing title and price", async () => {
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
