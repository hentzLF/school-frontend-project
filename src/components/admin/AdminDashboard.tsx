"use client";

import { useAdminDashboard } from "@/hooks/useAdmin";

export function AdminDashboard() {
  const { data, isLoading, error } = useAdminDashboard();

  if (isLoading) return <p className="text-gray-500">Loading dashboard...</p>;

  if (error) {
    return (
      <div
        role="alert"
        className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700"
      >
        Failed to load dashboard data.
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { label: "Total Users", value: data.totalUsers },
    { label: "Active Listings", value: data.activeListings },
    { label: "Total Bookings", value: data.totalBookings },
    { label: "Recent Bookings", value: data.recentBookings },
    { label: "Total Revenue", value: `${data.totalRevenue.toFixed(2)} EUR` },
    { label: "Total Listings", value: data.totalListings },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
