"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { BOOKING_ROUTES } from "@/config/constants";
import type {
  Booking,
  CreateBookingRequest,
  UpdateBookingStatusRequest,
} from "@/types/booking";

export function useBookings() {
  return useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: () => api<Booking[]>(BOOKING_ROUTES.list),
  });
}

export function useBooking(id: string) {
  return useQuery<Booking>({
    queryKey: ["bookings", id],
    queryFn: () => api<Booking>(BOOKING_ROUTES.detail(id)),
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, CreateBookingRequest>({
    mutationFn: (data) =>
      api<Booking>(BOOKING_ROUTES.list, { method: "POST", body: data }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    Booking,
    Error,
    { id: string } & UpdateBookingStatusRequest
  >({
    mutationFn: ({ id, status }) =>
      api<Booking>(BOOKING_ROUTES.updateStatus(id), {
        method: "PATCH",
        body: { status },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
