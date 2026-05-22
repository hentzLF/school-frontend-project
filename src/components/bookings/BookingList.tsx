"use client";

import Link from "next/link";
import { useBookings, useUpdateBookingStatus } from "@/hooks/useBookings";
import type { Booking } from "@/types/booking";

const statusColors: Record<Booking["status"], string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  InProgress: "bg-indigo-100 text-indigo-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export function BookingList() {
  const { data: bookings, isLoading, error } = useBookings();
  const updateStatus = useUpdateBookingStatus();

  const handleStatusUpdate = (id: string, status: Booking["status"]) => {
    if (status === "Pending") return;
    updateStatus.mutate({ id, status });
  };

  if (isLoading) return <p className="text-gray-500">Loading bookings...</p>;

  if (error) {
    return (
      <div
        role="alert"
        className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700"
      >
        Failed to load bookings.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bookings</h1>

      {!bookings || bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="border border-gray-200 rounded-lg p-4 bg-white"
            >
              <div className="flex items-start justify-between">
                <div>
                  <Link
                    href={`/bookings/${booking.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-green-700"
                  >
                    {booking.listingTitle}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(booking.startDate).toLocaleDateString()} —{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Client: {booking.clientName} | Provider:{" "}
                    {booking.providerName}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {booking.totalPrice.toFixed(2)} EUR
                  </span>
                </div>
              </div>

              {booking.notes && (
                <p className="mt-2 text-sm text-gray-600">{booking.notes}</p>
              )}

              {(booking.status === "Pending" ||
                booking.status === "Confirmed" ||
                booking.status === "InProgress") && (
                <div className="mt-3 flex gap-2">
                  {booking.status === "Pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusUpdate(booking.id, "Confirmed")
                        }
                        className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(booking.id, "Cancelled")
                        }
                        className="px-3 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status === "Confirmed" && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(booking.id, "InProgress")
                      }
                      className="px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Start Work
                    </button>
                  )}
                  {booking.status === "InProgress" && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(booking.id, "Completed")
                      }
                      className="px-3 py-1 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Complete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
