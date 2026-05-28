"use client";

import Link from "next/link";
import { Tag } from "lucide-react";
import type { Listing } from "@/types/listing";

type ListingCardProps = {
  listing: Listing;
};

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-all hover:shadow-md hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="space-y-1">
        <h3 className="line-clamp-1 font-semibold text-foreground group-hover:text-primary">
          {listing.title}
        </h3>
      </div>

      <p className="mt-auto text-lg font-bold text-primary">
        {listing.pricePerHectare.toFixed(2)} EUR / ha
      </p>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t pt-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Tag className="size-3.5" aria-hidden="true" />
          {listing.categoryName}
        </span>
        <span className="ml-auto font-medium text-foreground">
          {listing.providerName}
        </span>
      </div>
    </Link>
  );
}
