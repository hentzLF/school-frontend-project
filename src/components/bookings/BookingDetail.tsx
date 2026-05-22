"use client";

import Link from "next/link";
import { useBooking, useUpdateBookingStatus } from "@/hooks/useBookings";
import type { Booking } from "@/types/booking";

type BookingDetailProps = {
  bookingId: string;
};

const statusColors: Record<Booking["status"], string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  InProgress: "bg-indigo-100 text-indigo-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export function BookingDetail({ bookingId }: BookingDetailProps) {
  const { data: booking, isLoading, error } = useBooking(bookingId);
  const updateStatus = useUpdateBookingStatus();

  if (isLoading) return <p className="text-gray-500">Loading booking...</p>;
  if (error) {
    return (
      <div
        role="alert"
        className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700"
      >
        Failed to load booking.
      </div>
    );
  }
  if (!booking) return <p className="text-gray-500">Booking not found.</p>;

  const handleStatusUpdate = (status: Booking["status"]) => {
    if (status === "Pending") return;
    updateStatus.mutate({ id: bookingId, status });
  };

  return (
    <div className="max-w-2xl">
      <Link
        href="/bookings"
        className="text-sm text-green-600 hover:text-green-700 mb-4 inline-block"
      >
        &larr; Back to bookings
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {booking.listingTitle}
        </h1>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[booking.status]}`}
        >
          {booking.status}
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Client</p>
            <p className="font-medium">{booking.clientName}</p>
          </div>
          <div>
            <p className="text-gray-500">Provider</p>
            <p className="font-medium">{booking.providerName}</p>
          </div>
          <div>
            <p className="text-gray-500">Start Date</p>
            <p className="font-medium">
              {new Date(booking.startDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">End Date</p>
            <p className="font-medium">
              {new Date(booking.endDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Total Price</p>
            <p className="font-medium text-green-700">
              {booking.totalPrice.toFixed(2)} EUR
            </p>
          </div>
        </div>

        {booking.notes && (
          <div>
            <p className="text-sm text-gray-500">Notes</p>
            <p className="text-sm">{booking.notes}</p>
          </div>
        )}

        {(booking.status === "Pending" ||
          booking.status === "Confirmed" ||
          booking.status === "InProgress") && (
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            {booking.status === "Pending" && (
              <>
                <button
                  onClick={() => handleStatusUpdate("Confirmed")}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleStatusUpdate("Cancelled")}
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Cancel
                </button>
              </>
            )}
            {booking.status === "Confirmed" && (
              <button
                onClick={() => handleStatusUpdate("InProgress")}
                className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Start Work
              </button>
            )}
            {booking.status === "InProgress" && (
              <>
                <button
                  onClick={() => handleStatusUpdate("Completed")}
                  className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Complete
                </button>
                <Link
                  href={`/payments?bookingId=${booking.id}`}
                  className="px-4 py-2 text-sm font-medium bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Process Payment
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
