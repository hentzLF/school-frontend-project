"use client";

import Link from "next/link";
import { useListing } from "@/hooks/useListings";
import { ReviewList } from "@/components/reviews/ReviewList";
import { CreateReviewForm } from "@/components/reviews/CreateReviewForm";

type ListingDetailProps = {
  listingId: string;
};

export function ListingDetail({ listingId }: ListingDetailProps) {
  const { data: listing, isLoading, error } = useListing(listingId);

  if (isLoading) return <p className="text-gray-500">Loading listing...</p>;

  if (error) {
    return (
      <div
        role="alert"
        className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700"
      >
        Failed to load listing.
      </div>
    );
  }

  if (!listing) return <p className="text-gray-500">Listing not found.</p>;

  return (
    <div className="max-w-3xl">
      <Link
        href="/listings"
        className="text-sm text-green-600 hover:text-green-700 mb-4 inline-block"
      >
        &larr; Back to listings
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
        <span>{listing.categoryName}</span>
        <span>{listing.countyName}</span>
        <span>by {listing.providerName}</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <p className="text-gray-700 whitespace-pre-wrap">
          {listing.description}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-gray-500">Price</p>
          <p className="text-2xl font-bold text-green-700">
            {listing.price.toFixed(2)} EUR
            <span className="text-sm font-normal text-gray-500">
              {" "}
              / {listing.priceUnit}
            </span>
          </p>
        </div>
        <Link
          href={`/bookings/new?listingId=${listing.id}`}
          className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
        >
          Book Now
        </Link>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>
        <ReviewList listingId={listingId} />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Write a Review
        </h3>
        <CreateReviewForm listingId={listingId} />
      </div>
    </div>
  );
}
