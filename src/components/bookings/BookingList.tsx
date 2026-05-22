"use client";

import Link from "next/link";
import { CalendarRange, CalendarX2 } from "lucide-react";
import { useBookings, useUpdateBookingStatus } from "@/hooks/useBookings";
import { useTranslation } from "@/hooks/useTranslation";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Booking } from "@/types/booking";

export function BookingList() {
  const { data: bookings, isLoading, error } = useBookings();
  const updateStatus = useUpdateBookingStatus();
  const { t } = useTranslation();

  const handleStatusUpdate = (id: string, status: Booking["status"]) => {
    if (status === "Pending") return;
    updateStatus.mutate({ id, status });
  };

  if (isLoading) return <LoadingState label={t("common.loading")} />;
  if (error) return <ErrorState message={t("bookings.loadError")} />;

  return (
    <div>
      <PageHeader title={t("bookings.title")} />

      {!bookings || bookings.length === 0 ? (
        <EmptyState
          icon={CalendarX2}
          title={t("bookings.noBookings")}
          description={t("dashboard.bookingsDesc")}
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <Link
                      href={`/bookings/${booking.id}`}
                      className="font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      {booking.listingTitle}
                    </Link>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CalendarRange className="size-4" aria-hidden="true" />
                      {new Date(booking.startDate).toLocaleDateString()} —{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("bookings.client")}: {booking.clientName} ·{" "}
                      {t("bookings.provider")}: {booking.providerName}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <StatusBadge
                      status={booking.status}
                      label={t(`bookings.status.${booking.status}`)}
                    />
                    <span className="text-sm font-bold text-foreground">
                      {booking.totalPrice.toFixed(2)} EUR
                    </span>
                  </div>
                </div>

                {booking.notes && (
                  <p className="rounded-md bg-muted/60 p-2.5 text-sm text-muted-foreground">
                    {booking.notes}
                  </p>
                )}

                {booking.status === "Pending" && (
                  <div className="flex gap-2 border-t pt-3">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleStatusUpdate(booking.id, "Confirmed")
                      }
                    >
                      {t("bookings.confirm")}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        handleStatusUpdate(booking.id, "Cancelled")
                      }
                    >
                      {t("common.cancel")}
                    </Button>
                  </div>
                )}
                {booking.status === "Confirmed" && (
                  <div className="flex gap-2 border-t pt-3">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleStatusUpdate(booking.id, "InProgress")
                      }
                    >
                      {t("bookings.startWork")}
                    </Button>
                  </div>
                )}
                {booking.status === "InProgress" && (
                  <div className="flex gap-2 border-t pt-3">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleStatusUpdate(booking.id, "Completed")
                      }
                    >
                      {t("bookings.complete")}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
