"use client";

import { useState } from "react";
import Link from "next/link";
import { useListings } from "@/hooks/useListings";
import { ListingCard } from "@/components/listings/ListingCard";
import { ListingFilters } from "@/components/listings/ListingFilters";
import type { ListingFilters as ListingFiltersType } from "@/types/listing";

export function ListingList() {
  const [filters, setFilters] = useState<ListingFiltersType>({
    page: 1,
    pageSize: 12,
  });

  const { data, isLoading, error } = useListings(filters);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Listings</h1>
        <Link
          href="/listings/new"
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
        >
          Create Listing
        </Link>
      </div>

      <ListingFilters filters={filters} onFiltersChange={setFilters} />

      {isLoading && <p className="text-gray-500">Loading listings...</p>}

      {error && (
        <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          Failed to load listings. Please try again.
        </div>
      )}

      {data && data.items.length === 0 && (
        <p className="text-gray-500">No listings found.</p>
      )}

      {data && data.items.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.items.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
                disabled={!filters.page || filters.page <= 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {filters.page ?? 1} of {data.totalPages}
              </span>
              <button
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
                disabled={(filters.page ?? 1) >= data.totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
