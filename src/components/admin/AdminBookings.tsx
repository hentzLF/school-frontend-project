"use client";

import { useAdminBookings } from "@/hooks/useAdmin";
import type { Booking } from "@/types/booking";

const statusColors: Record<Booking["status"], string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  InProgress: "bg-indigo-100 text-indigo-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export function AdminBookings() {
  const { data: bookings, isLoading, error } = useAdminBookings();

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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Booking Management
      </h1>

      {!bookings || bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Listing
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Client
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Provider
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Dates
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Total
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-4 py-3 text-gray-900">
                    {booking.listingTitle}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {booking.clientName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {booking.providerName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(booking.startDate).toLocaleDateString()} —{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {booking.totalPrice.toFixed(2)} EUR
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${statusColors[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
