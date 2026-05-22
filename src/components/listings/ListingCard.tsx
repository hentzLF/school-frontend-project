"use client";

import Link from "next/link";
import type { Listing } from "@/types/listing";

type ListingCardProps = {
  listing: Listing;
};

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {listing.title}
      </h3>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
        {listing.description}
      </p>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-green-700">
          {listing.price.toFixed(2)} EUR / {listing.priceUnit}
        </span>
        <span className="text-gray-500">{listing.countyName}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
        <span>{listing.categoryName}</span>
        <span>{listing.providerName}</span>
      </div>
    </Link>
  );
}
