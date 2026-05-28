"use client";

import { PackageSearch, Trash2 } from "lucide-react";
import { useAdminListings, useDeleteListing } from "@/hooks/useAdmin";
import { useTranslation } from "@/hooks/useTranslation";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AdminListings() {
  const { data: listings, isLoading, error } = useAdminListings();
  const deleteListing = useDeleteListing();
  const { t } = useTranslation();

  if (isLoading) return <LoadingState label={t("common.loading")} />;
  if (error) return <ErrorState message={t("admin.loadError")} />;

  return (
    <div>
      <PageHeader title={t("admin.listingManagement")} />

      {!listings || listings.length === 0 ? (
        <EmptyState icon={PackageSearch} title={t("common.noResults")} />
      ) : (
        <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>{t("listings.titleLabel")}</TableHead>
                <TableHead>{t("bookings.provider")}</TableHead>
                <TableHead>{t("listings.category")}</TableHead>
                <TableHead>{t("listings.price")}</TableHead>
                <TableHead>{t("admin.status")}</TableHead>
                <TableHead className="text-right">
                  {t("admin.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium text-foreground">
                    {listing.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {listing.providerName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {listing.categoryName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {listing.pricePerHectare.toFixed(2)} EUR / ha
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={listing.isActive ? "Active" : "Inactive"}
                      label={listing.isActive ? "Active" : "Inactive"}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <ConfirmDialog
                      title={t("admin.confirmDelete")}
                      description={t("admin.confirmDeleteText")}
                      confirmLabel={t("common.delete")}
                      cancelLabel={t("common.cancel")}
                      onConfirm={() => deleteListing.mutate(listing.id)}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t("common.delete")}
                        >
                          <Trash2 aria-hidden="true" />
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
