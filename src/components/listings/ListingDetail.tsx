"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Star, Tag, User } from "lucide-react";
import { useListing } from "@/hooks/useListings";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { ManageAvailabilities } from "@/components/listings/ManageAvailabilities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ListingDetailProps = {
  listingId: string;
};

export function ListingDetail({ listingId }: ListingDetailProps) {
  const { data: listing, isLoading, error } = useListing(listingId);
  const { user } = useAuth();
  const { t } = useTranslation();

  if (isLoading) return <LoadingState label={t("common.loading")} />;

  if (error) return <ErrorState message={t("listings.loadError")} />;

  if (!listing) return <ErrorState message={t("common.noResults")} />;

  const isOwner = !!user && user.id === listing.providerUserId;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/listings"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t("listings.backToListings")}
      </Link>

      <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {listing.title}
      </h1>

      <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Tag className="size-4" aria-hidden="true" />
          {listing.categoryName}
        </span>
        {listing.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-4" aria-hidden="true" />
            {listing.location.countyName}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <User className="size-4" aria-hidden="true" />
          {listing.providerName}
        </span>
        {listing.reviewCount > 0 && (
          <span className="inline-flex items-center gap-1">
            <Star className="size-4" aria-hidden="true" />
            {listing.averageRating.toFixed(1)} ({listing.reviewCount}{" "}
            {t("listings.reviews")})
          </span>
        )}
      </div>

      {listing.description && (
        <Card className="mb-6">
          <CardContent>
            <p className="whitespace-pre-wrap text-foreground/90">
              {listing.description}
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="mb-8">
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {t("listings.price")}
            </p>
            <p className="text-2xl font-bold text-primary">
              {listing.pricePerHectare.toFixed(2)} EUR
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / ha
              </span>
            </p>
          </div>
          {isOwner ? (
            <p className="text-sm text-muted-foreground">
              {t("listings.ownListingNotice")}
            </p>
          ) : (
            <Button
              size="lg"
              render={<Link href={`/bookings/new?listingId=${listing.id}`} />}
            >
              {t("listings.bookNow")}
            </Button>
          )}
        </CardContent>
      </Card>

      {isOwner && <ManageAvailabilities listingId={listing.id} />}
    </div>
  );
}
