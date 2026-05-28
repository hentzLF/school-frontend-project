"use client";

import Link from "next/link";
import { CalendarX2, MapPin, Tag } from "lucide-react";
import { useBookings, useUpdateBookingStatus } from "@/hooks/useBookings";
import { useListing } from "@/hooks/useListings";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Booking, BookingStatus } from "@/types/booking";

type ActionProps = {
  booking: Booking;
  isClient: boolean;
  isProvider: boolean;
  onUpdate: (status: BookingStatus) => void;
  isPending: boolean;
};

function BookingActions({ booking, isClient, isProvider, onUpdate, isPending }: ActionProps) {
  const { t } = useTranslation();
  const s = booking.status;

  const hasActions =
    (isProvider && (s === "Pending" || s === "Confirmed" || s === "InProgress" || s === "AwaitingPayment")) ||
    (isClient && (s === "Pending" || s === "AwaitingPayment" || s === "Confirmed" || s === "ProviderCompleted"));

  if (!hasActions) return null;

  return (
    <div className="flex flex-wrap gap-2 border-t pt-3" onClick={(e) => e.preventDefault()}>
      {isProvider && s === "Pending" && (
        <Button size="sm" disabled={isPending} onClick={() => onUpdate("AwaitingPayment")}>
          {t("bookings.requestPayment")}
        </Button>
      )}
      {isProvider && s === "Confirmed" && (
        <Button size="sm" disabled={isPending} onClick={() => onUpdate("InProgress")}>
          {t("bookings.startWork")}
        </Button>
      )}
      {isProvider && s === "InProgress" && (
        <Button size="sm" disabled={isPending} onClick={() => onUpdate("ProviderCompleted")}>
          {t("bookings.complete")}
        </Button>
      )}
      {isClient && s === "AwaitingPayment" && (
        <Button size="sm" disabled={isPending} onClick={() => onUpdate("Confirmed")}>
          {t("bookings.confirmPayment")}
        </Button>
      )}
      {isClient && s === "ProviderCompleted" && (
        <Button size="sm" disabled={isPending} onClick={() => onUpdate("ClientConfirmed")}>
          {t("bookings.confirmComplete")}
        </Button>
      )}
      {isClient && (s === "Pending" || s === "AwaitingPayment" || s === "Confirmed") && (
        <Button size="sm" variant="destructive" disabled={isPending} onClick={() => onUpdate("Cancelled")}>
          {t("common.cancel")}
        </Button>
      )}
      {isProvider && (s === "Pending" || s === "AwaitingPayment") && (
        <Button size="sm" variant="destructive" disabled={isPending} onClick={() => onUpdate("Cancelled")}>
          {t("common.cancel")}
        </Button>
      )}
    </div>
  );
}

type BookingCardBodyProps = {
  booking: Booking;
  isClient: boolean;
  isProvider: boolean;
  onUpdate: (status: BookingStatus) => void;
  isPending: boolean;
};

function BookingCardBody({ booking, isClient, isProvider, onUpdate, isPending }: BookingCardBodyProps) {
  const { data: listing } = useListing(booking.serviceListingId);
  const { t } = useTranslation();
  const isTerminal = terminalStatuses.includes(booking.status);

  const title = listing?.title ?? booking.listingTitle ?? booking.serviceListingId;
  const clientLabel = booking.clientName || "—";

  return (
    <CardContent className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="font-semibold text-foreground">{title}</p>
          {listing && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Tag className="size-3" aria-hidden="true" />
                {listing.categoryName}
              </span>
              {listing.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3" aria-hidden="true" />
                  {listing.location.countyName}
                </span>
              )}
              <span>{listing.pricePerHectare.toFixed(2)} EUR / ha</span>
            </div>
          )}
          {booking.availabilityStart && booking.availabilityEnd && (
            <p className="text-sm text-muted-foreground">
              {new Date(booking.availabilityStart).toLocaleDateString()} —{" "}
              {new Date(booking.availabilityEnd).toLocaleDateString()}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            {t("bookings.client")}: {clientLabel}
            {" · "}
            {t("bookings.areaInHectares")}: {booking.areaInHectares} ha
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

      {!isTerminal && (
        <BookingActions
          booking={booking}
          isClient={isClient}
          isProvider={isProvider}
          onUpdate={onUpdate}
          isPending={isPending}
        />
      )}
    </CardContent>
  );
}

const terminalStatuses: BookingStatus[] = ["ClientConfirmed", "Archived", "Cancelled", "Disputed"];

export function BookingList() {
  const { data: bookings, isLoading, error } = useBookings();
  const updateStatus = useUpdateBookingStatus();
  const { user } = useAuth();
  const { t } = useTranslation();

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
          {bookings.map((booking) => {
            const isClient = !!user && user.profileId === booking.clientProfileId;
            const isProvider = !!user && user.profileId === booking.providerProfileId;

            return (
              <Link key={booking.id} href={`/bookings/${booking.id}`} className="block">
                <Card className="transition-colors hover:bg-accent/40">
                  <BookingCardBody
                    booking={booking}
                    isClient={isClient}
                    isProvider={isProvider}
                    onUpdate={(status) => updateStatus.mutate({ id: booking.id, status })}
                    isPending={updateStatus.isPending}
                  />
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
