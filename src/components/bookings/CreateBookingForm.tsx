"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreateBooking } from "@/hooks/useBookings";
import { useListing } from "@/hooks/useListings";
import { useTranslation } from "@/hooks/useTranslation";
import { ApiError } from "@/lib/api";
import { PageHeader } from "@/components/common/PageHeader";
import { FormAlert } from "@/components/common/FormAlert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const bookingSchema = z.object({
  listingId: z.string().min(1, "Listing is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const fieldError = "text-xs text-destructive";

export function CreateBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId") ?? "";
  const { data: listing } = useListing(listingId);
  const createBooking = useCreateBooking();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { listingId },
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
                {listing.price.toFixed(2)} EUR / {listing.priceUnit}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMessage && <FormAlert message={errorMessage} />}

            <input type="hidden" {...register("listingId")} />

            <div className="space-y-1.5">
              <Label htmlFor="startDate">{t("bookings.startDate")}</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate")}
                aria-invalid={!!errors.startDate}
              />
              {errors.startDate && (
                <p role="alert" className={fieldError}>
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="endDate">{t("bookings.endDate")}</Label>
              <Input
                id="endDate"
                type="date"
                {...register("endDate")}
                aria-invalid={!!errors.endDate}
              />
              {errors.endDate && (
                <p role="alert" className={fieldError}>
                  {errors.endDate.message}
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
              disabled={createBooking.isPending}
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
