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
  id: "b1",
  listingId: "l1",
  listingTitle: "Tractor Service",
  clientId: "c1",
  clientName: "Client One",
  providerId: "p1",
  providerName: "Provider One",
  status: "Pending",
  startDate: "2026-06-01",
  endDate: "2026-06-02",
  totalPrice: 150,
  notes: null,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
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
      listingId: "l1",
      startDate: "2026-06-01",
      endDate: "2026-06-02",
      notes: "Please arrive early",
    });

    expect(mockApi).toHaveBeenCalledWith("/api/bookings", {
      method: "POST",
      body: {
        listingId: "l1",
        startDate: "2026-06-01",
        endDate: "2026-06-02",
        notes: "Please arrive early",
      },
    });
  });
});

describe("useUpdateBookingStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call api with PUT and new status", async () => {
    mockApi.mockResolvedValue({ ...mockBooking, status: "Confirmed" });

    const { result } = renderHook(() => useUpdateBookingStatus(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({ id: "b1", status: "Confirmed" });

    expect(mockApi).toHaveBeenCalledWith("/api/bookings/b1/status", {
      method: "PUT",
      body: { status: "Confirmed" },
    });
  });
});
