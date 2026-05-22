"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Tag, User } from "lucide-react";
import { useListing } from "@/hooks/useListings";
import { useTranslation } from "@/hooks/useTranslation";
import { ReviewList } from "@/components/reviews/ReviewList";
import { CreateReviewForm } from "@/components/reviews/CreateReviewForm";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ListingDetailProps = {
  listingId: string;
};

export function ListingDetail({ listingId }: ListingDetailProps) {
  const { data: listing, isLoading, error } = useListing(listingId);
  const { t } = useTranslation();

  if (isLoading) return <LoadingState label={t("common.loading")} />;

  if (error) return <ErrorState message={t("listings.loadError")} />;

  if (!listing) return <ErrorState message={t("common.noResults")} />;

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
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-4" aria-hidden="true" />
          {listing.countyName}
        </span>
        <span className="inline-flex items-center gap-1">
          <User className="size-4" aria-hidden="true" />
          {listing.providerName}
        </span>
      </div>

      <Card className="mb-6">
        <CardContent>
          <p className="whitespace-pre-wrap text-foreground/90">
            {listing.description}
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {t("listings.price")}
            </p>
            <p className="text-2xl font-bold text-primary">
              {listing.price.toFixed(2)} EUR
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / {listing.priceUnit}
              </span>
            </p>
          </div>
          <Button
            size="lg"
            render={<Link href={`/bookings/new?listingId=${listing.id}`} />}
          >
            {t("listings.bookNow")}
          </Button>
        </CardContent>
      </Card>

      <section className="mb-6">
        <h2 className="mb-4 text-xl font-bold text-foreground">
          {t("reviews.title")}
        </h2>
        <ReviewList listingId={listingId} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("reviews.writeReview")}</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateReviewForm listingId={listingId} />
        </CardContent>
      </Card>
    </div>
  );
}
