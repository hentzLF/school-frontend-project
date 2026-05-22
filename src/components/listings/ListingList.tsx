"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, PackageSearch, Plus } from "lucide-react";
import { useListings } from "@/hooks/useListings";
import { useTranslation } from "@/hooks/useTranslation";
import { ListingCard } from "@/components/listings/ListingCard";
import { ListingFilters } from "@/components/listings/ListingFilters";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import type { ListingFilters as ListingFiltersType } from "@/types/listing";

export function ListingList() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<ListingFiltersType>({
    page: 1,
    pageSize: 12,
  });

  const { data, isLoading, error } = useListings(filters);

  return (
    <div>
      <PageHeader
        title={t("listings.title")}
        action={
          <Button render={<Link href="/listings/new" />}>
            <Plus aria-hidden="true" />
            {t("listings.createListing")}
          </Button>
        }
      />

      <ListingFilters filters={filters} onFiltersChange={setFilters} />

      {isLoading && <LoadingState label={t("common.loading")} />}

      {error && <ErrorState message={t("listings.loadError")} />}

      {data && data.items.length === 0 && (
        <EmptyState
          icon={PackageSearch}
          title={t("listings.noListings")}
          description={t("dashboard.listingsDesc")}
        />
      )}

      {data && data.items.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))
                }
                disabled={!filters.page || filters.page <= 1}
              >
                <ChevronLeft aria-hidden="true" />
                {t("common.previous")}
              </Button>
              <span className="text-sm text-muted-foreground">
                {t("common.page")} {filters.page ?? 1} {t("common.of")}{" "}
                {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))
                }
                disabled={(filters.page ?? 1) >= data.totalPages}
              >
                {t("common.next")}
                <ChevronRight aria-hidden="true" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
