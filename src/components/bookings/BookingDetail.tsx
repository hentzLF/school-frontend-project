"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useBooking, useUpdateBookingStatus } from "@/hooks/useBookings";
import { useTranslation } from "@/hooks/useTranslation";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Booking } from "@/types/booking";

type BookingDetailProps = {
  bookingId: string;
};

type DetailRowProps = {
  label: string;
  value: string;
  accent?: boolean;
};

function DetailRow({ label, value, accent }: DetailRowProps) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={
          accent ? "font-semibold text-primary" : "font-medium text-foreground"
        }
      >
        {value}
      </p>
    </div>
  );
}

export function BookingDetail({ bookingId }: BookingDetailProps) {
  const { data: booking, isLoading, error } = useBooking(bookingId);
  const updateStatus = useUpdateBookingStatus();
  const { t } = useTranslation();

  if (isLoading) return <LoadingState label={t("common.loading")} />;
  if (error) return <ErrorState message={t("bookings.loadError")} />;
  if (!booking) return <ErrorState message={t("common.noResults")} />;

  const handleStatusUpdate = (status: Booking["status"]) => {
    if (status === "Pending") return;
    updateStatus.mutate({ id: bookingId, status });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/bookings"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t("bookings.backToBookings")}
      </Link>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {booking.listingTitle}
        </h1>
        <StatusBadge
          status={booking.status}
          label={t(`bookings.status.${booking.status}`)}
        />
      </div>

      <Card>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <DetailRow
              label={t("bookings.client")}
              value={booking.clientName}
            />
            <DetailRow
              label={t("bookings.provider")}
              value={booking.providerName}
            />
            <DetailRow
              label={t("bookings.startDate")}
              value={new Date(booking.startDate).toLocaleDateString()}
            />
            <DetailRow
              label={t("bookings.endDate")}
              value={new Date(booking.endDate).toLocaleDateString()}
            />
            <DetailRow
              label={t("bookings.totalPrice")}
              value={`${booking.totalPrice.toFixed(2)} EUR`}
              accent
            />
          </div>

          {booking.notes && (
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">
                {t("bookings.notes")}
              </p>
              <p className="text-sm text-foreground">{booking.notes}</p>
            </div>
          )}

          {booking.status === "Pending" && (
            <div className="flex flex-wrap gap-2 border-t pt-4">
              <Button onClick={() => handleStatusUpdate("Confirmed")}>
                {t("bookings.confirm")}
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleStatusUpdate("Cancelled")}
              >
                {t("common.cancel")}
              </Button>
            </div>
          )}
          {booking.status === "Confirmed" && (
            <div className="flex flex-wrap gap-2 border-t pt-4">
              <Button onClick={() => handleStatusUpdate("InProgress")}>
                {t("bookings.startWork")}
              </Button>
            </div>
          )}
          {booking.status === "InProgress" && (
            <div className="flex flex-wrap gap-2 border-t pt-4">
              <Button onClick={() => handleStatusUpdate("Completed")}>
                {t("bookings.complete")}
              </Button>
              <Button
                variant="outline"
                render={<Link href={`/payments?bookingId=${booking.id}`} />}
              >
                {t("bookings.processPayment")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
