"use client";

import { CalendarX2 } from "lucide-react";
import { useAdminBookings } from "@/hooks/useAdmin";
import { useTranslation } from "@/hooks/useTranslation";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AdminBookings() {
  const { data: bookings, isLoading, error } = useAdminBookings();
  const { t } = useTranslation();

  if (isLoading) return <LoadingState label={t("common.loading")} />;
  if (error) return <ErrorState message={t("admin.loadError")} />;

  return (
    <div>
      <PageHeader title={t("admin.bookingManagement")} />

      {!bookings || bookings.length === 0 ? (
        <EmptyState icon={CalendarX2} title={t("common.noResults")} />
      ) : (
        <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>{t("admin.listing")}</TableHead>
                <TableHead>{t("bookings.client")}</TableHead>
                <TableHead>{t("bookings.provider")}</TableHead>
                <TableHead>{t("admin.dates")}</TableHead>
                <TableHead>{t("admin.total")}</TableHead>
                <TableHead>{t("admin.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium text-foreground">
                    {booking.listingTitle}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {booking.clientName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {booking.providerName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(booking.startDate).toLocaleDateString()} —{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {booking.totalPrice.toFixed(2)} EUR
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={booking.status}
                      label={t(`bookings.status.${booking.status}`)}
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
