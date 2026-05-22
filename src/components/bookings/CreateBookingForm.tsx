"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreateBooking } from "@/hooks/useBookings";
import { useListing } from "@/hooks/useListings";
import { ApiError } from "@/lib/api";

const bookingSchema = z.object({
  listingId: z.string().min(1, "Listing is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function CreateBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId") ?? "";
  const { data: listing } = useListing(listingId);
  const createBooking = useCreateBooking();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { listingId },
  });

  const onSubmit = async (data: BookingFormValues) => {
    try {
      await createBooking.mutateAsync(data);
      router.push("/bookings");
    } catch {
      // Error captured by mutation
    }
  };

  const apiError = createBooking.error;
  const errorMessage =
    apiError instanceof ApiError
      ? apiError.message
      : apiError
        ? "An unexpected error occurred."
        : null;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Booking</h1>

      {listing && (
        <p className="text-sm text-gray-600 mb-6">
          Booking: <span className="font-medium">{listing.title}</span> — {listing.price.toFixed(2)} EUR / {listing.priceUnit}
        </p>
      )}

      {errorMessage && (
        <div role="alert" className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("listingId")} />

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            id="startDate"
            type="date"
            {...register("startDate")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-invalid={!!errors.startDate}
          />
          {errors.startDate && <p role="alert" className="mt-1 text-xs text-red-600">{errors.startDate.message}</p>}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            id="endDate"
            type="date"
            {...register("endDate")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-invalid={!!errors.endDate}
          />
          {errors.endDate && <p role="alert" className="mt-1 text-xs text-red-600">{errors.endDate.message}</p>}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
          <textarea
            id="notes"
            rows={3}
            {...register("notes")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={createBooking.isPending}
          className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createBooking.isPending ? "Creating..." : "Create Booking"}
        </button>
      </form>
    </div>
  );
}
