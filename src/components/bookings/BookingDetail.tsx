"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Tag } from "lucide-react";
import { useBooking, useUpdateBookingStatus } from "@/hooks/useBookings";
import { useListing } from "@/hooks/useListings";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { BookingStatus } from "@/types/booking";

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
      <p className={accent ? "font-semibold text-primary" : "font-medium text-foreground"}>
        {value}
      </p>
    </div>
  );
}

export function BookingDetail({ bookingId }: BookingDetailProps) {
  const { data: booking, isLoading, error } = useBooking(bookingId);
  const { data: listing } = useListing(booking?.serviceListingId ?? "");
  const updateStatus = useUpdateBookingStatus();
  const { user } = useAuth();
  const { t } = useTranslation();

  if (isLoading) return <LoadingState label={t("common.loading")} />;
  if (error) return <ErrorState message={t("bookings.loadError")} />;
  if (!booking) return <ErrorState message={t("common.noResults")} />;

  const isClient = !!user && user.profileId === booking.clientProfileId;
  const isProvider = !!user && user.profileId === booking.providerProfileId;
  const s = booking.status;

  const update = (status: BookingStatus) =>
    updateStatus.mutate({ id: bookingId, status });

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/bookings"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t("bookings.backToBookings")}
      </Link>

      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {booking.listingTitle}
        </h1>
        <StatusBadge
          status={booking.status}
          label={t(`bookings.status.${booking.status}`)}
        />
      </div>

      {listing && (
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
          <span className="font-medium text-primary">
            {listing.pricePerHectare.toFixed(2)} EUR / ha
          </span>
        </div>
      )}

      <Card>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <DetailRow
              label={t("bookings.client")}
              value={booking.clientName}
            />
            {booking.availabilityStart && (
              <DetailRow
                label={t("bookings.startDate")}
                value={new Date(booking.availabilityStart).toLocaleString()}
              />
            )}
            {booking.availabilityEnd && (
              <DetailRow
                label={t("bookings.endDate")}
                value={new Date(booking.availabilityEnd).toLocaleString()}
              />
            )}
            <DetailRow
              label={t("bookings.areaInHectares")}
              value={`${booking.areaInHectares} ha`}
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

          {/* Provider actions */}
          {isProvider && s === "Pending" && (
            <div className="flex flex-wrap gap-2 border-t pt-4">
              <Button disabled={updateStatus.isPending} onClick={() => update("AwaitingPayment")}>
                {t("bookings.requestPayment")}
              </Button>
              <Button variant="destructive" disabled={updateStatus.isPending} onClick={() => update("Cancelled")}>
                {t("common.cancel")}
              </Button>
            </div>
          )}
          {isProvider && s === "AwaitingPayment" && (
            <div className="flex flex-wrap gap-2 border-t pt-4">
              <Button variant="destructive" disabled={updateStatus.isPending} onClick={() => update("Cancelled")}>
                {t("common.cancel")}
              </Button>
            </div>
          )}
          {isProvider && s === "Confirmed" && (
            <div className="flex flex-wrap gap-2 border-t pt-4">
              <Button disabled={updateStatus.isPending} onClick={() => update("InProgress")}>
                {t("bookings.startWork")}
              </Button>
            </div>
          )}
          {isProvider && s === "InProgress" && (
            <div className="flex flex-wrap gap-2 border-t pt-4">
              <Button disabled={updateStatus.isPending} onClick={() => update("ProviderCompleted")}>
                {t("bookings.complete")}
              </Button>
            </div>
          )}

          {/* Client actions */}
          {isClient && s === "Pending" && (
            <div className="flex flex-wrap gap-2 border-t pt-4">
              <Button variant="destructive" disabled={updateStatus.isPending} onClick={() => update("Cancelled")}>
                {t("common.cancel")}
              </Button>
            </div>
          )}
          {isClient && s === "AwaitingPayment" && (
            <div className="flex flex-wrap gap-2 border-t pt-4">
              <Button disabled={updateStatus.isPending} onClick={() => update("Confirmed")}>
                {t("bookings.confirmPayment")}
              </Button>
              <Button variant="destructive" disabled={updateStatus.isPending} onClick={() => update("Cancelled")}>
                {t("common.cancel")}
              </Button>
            </div>
          )}
          {isClient && s === "Confirmed" && (
            <div className="flex flex-wrap gap-2 border-t pt-4">
              <Button variant="destructive" disabled={updateStatus.isPending} onClick={() => update("Cancelled")}>
                {t("common.cancel")}
              </Button>
            </div>
          )}
          {isClient && s === "ProviderCompleted" && (
            <div className="flex flex-wrap gap-2 border-t pt-4">
              <Button disabled={updateStatus.isPending} onClick={() => update("ClientConfirmed")}>
                {t("bookings.confirmComplete")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
