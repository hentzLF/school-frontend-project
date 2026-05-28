import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/lib/api", () => ({
  api: vi.fn(),
}));

import { api } from "@/lib/api";
import {
  useBookings,
  useBooking,
  useCreateBooking,
  useUpdateBookingStatus,
} from "./useBookings";
import type { Booking } from "@/types/booking";

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

const mockBooking: Booking = {
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  status: "Pending",
  totalPrice: 150,
  areaInHectares: 3,
  createdAt: "2026-01-01T00:00:00Z",
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

describe("useBookings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch the list of bookings", async () => {
    mockApi.mockResolvedValue([mockBooking]);

    const { result } = renderHook(() => useBookings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([mockBooking]);
    expect(mockApi).toHaveBeenCalledWith("/api/bookings");
  });
});

describe("useBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch a single booking by id", async () => {
    mockApi.mockResolvedValue(mockBooking);

    const { result } = renderHook(() => useBooking("b1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockBooking);
    expect(mockApi).toHaveBeenCalledWith("/api/bookings/b1");
  });

  it("should remain idle when no id is provided", () => {
    const { result } = renderHook(() => useBooking(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useCreateBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call api with POST and booking data", async () => {
    mockApi.mockResolvedValue(mockBooking);

    const { result } = renderHook(() => useCreateBooking(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      serviceListingId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      availabilityId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      areaInHectares: 3,
      notes: "Please arrive early",
    });

    expect(mockApi).toHaveBeenCalledWith("/api/bookings", {
      method: "POST",
      body: {
        serviceListingId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        availabilityId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        areaInHectares: 3,
        notes: "Please arrive early",
      },
    });
  });
});

describe("useUpdateBookingStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call api with PATCH and new status", async () => {
    mockApi.mockResolvedValue({ ...mockBooking, status: "AwaitingPayment" });

    const { result } = renderHook(() => useUpdateBookingStatus(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({ id: "b1", status: "AwaitingPayment" });

    expect(mockApi).toHaveBeenCalledWith("/api/bookings/b1/status", {
      method: "PATCH",
      body: { status: "AwaitingPayment" },
    });
  });
});
