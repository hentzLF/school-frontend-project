"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreateBooking } from "@/hooks/useBookings";
import { useListing, useAvailabilities } from "@/hooks/useListings";
import { useTranslation } from "@/hooks/useTranslation";
import { ApiError } from "@/lib/api";
import { PageHeader } from "@/components/common/PageHeader";
import { FormAlert } from "@/components/common/FormAlert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const bookingSchema = z.object({
  serviceListingId: z.string().uuid(),
  availabilityId: z.string().uuid("Select a time slot"),
  areaInHectares: z.number().positive("Area must be positive"),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const fieldError = "text-xs text-destructive";

function formatSlot(startTime: string, endTime: string): string {
  const fmt = (d: string) =>
    new Date(d).toLocaleString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  return `${fmt(startTime)} – ${fmt(endTime)}`;
}

export function CreateBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId") ?? "";
  const { data: listing } = useListing(listingId);
  const { data: availabilities } = useAvailabilities(listingId || undefined);
  const createBooking = useCreateBooking();
  const { t } = useTranslation();

  const freeSlots = availabilities?.filter((a) => !a.isBooked) ?? [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { serviceListingId: listingId },
  });

  const onSubmit = async (data: BookingFormValues) => {
    try {
      await createBooking.mutateAsync(data);
      router.push("/bookings");
    } catch {
      // Error captured by mutation
    }
  };

  const apiError = createBooking.error;
  const errorMessage =
    apiError instanceof ApiError
      ? apiError.message
      : apiError
        ? t("auth.unexpectedError")
        : null;

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title={t("bookings.createBooking")} />

      <Card>
        <CardContent>
          {listing && (
            <div className="mb-4 rounded-lg border bg-muted/50 p-3 text-sm">
              <p className="font-medium text-foreground">{listing.title}</p>
              <p className="text-muted-foreground">
                {listing.pricePerHectare.toFixed(2)} EUR / ha
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMessage && <FormAlert message={errorMessage} />}

            <input type="hidden" {...register("serviceListingId")} />

            <div className="space-y-1.5">
              <Label htmlFor="availabilityId">{t("bookings.selectSlot")}</Label>
              {freeSlots.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("bookings.noSlots")}
                </p>
              ) : (
                <Controller
                  name="availabilityId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="availabilityId"
                        aria-invalid={!!errors.availabilityId}
                      >
                        <SelectValue placeholder={t("bookings.selectSlot")}>
                          {freeSlots.find((s) => s.id === field.value)
                            ? formatSlot(
                                freeSlots.find((s) => s.id === field.value)!
                                  .startTime,
                                freeSlots.find((s) => s.id === field.value)!
                                  .endTime,
                              )
                            : null}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {freeSlots.map((slot) => (
                          <SelectItem key={slot.id} value={slot.id}>
                            {formatSlot(slot.startTime, slot.endTime)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
              {errors.availabilityId && (
                <p role="alert" className={fieldError}>
                  {errors.availabilityId.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="areaInHectares">
                {t("bookings.areaInHectares")}
              </Label>
              <Input
                id="areaInHectares"
                type="number"
                step="0.01"
                min="0.01"
                {...register("areaInHectares", { valueAsNumber: true })}
                aria-invalid={!!errors.areaInHectares}
              />
              {errors.areaInHectares && (
                <p role="alert" className={fieldError}>
                  {errors.areaInHectares.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">{t("bookings.notes")}</Label>
              <Textarea id="notes" rows={3} {...register("notes")} />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={createBooking.isPending || freeSlots.length === 0}
            >
              {createBooking.isPending
                ? t("bookings.creating")
                : t("bookings.createBooking")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
