"use client";

import { useAdminListings, useDeleteListing } from "@/hooks/useAdmin";

export function AdminListings() {
  const { data: listings, isLoading, error } = useAdminListings();
  const deleteListing = useDeleteListing();

  if (isLoading) return <p className="text-gray-500">Loading listings...</p>;
  if (error) {
    return (
      <div
        role="alert"
        className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700"
      >
        Failed to load listings.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Listing Management
      </h1>

      {!listings || listings.length === 0 ? (
        <p className="text-gray-500">No listings found.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Title
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Provider
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Category
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Price
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">
                  Status
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listings.map((listing) => (
                <tr key={listing.id}>
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    {listing.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {listing.providerName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {listing.categoryName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {listing.price.toFixed(2)} EUR
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        listing.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : listing.status === "Inactive"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`Delete listing "${listing.title}"?`)) {
                          deleteListing.mutate(listing.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
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
