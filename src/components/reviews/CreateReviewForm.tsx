"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateReview } from "@/hooks/useReviews";
import { useTranslation } from "@/hooks/useTranslation";
import { ApiError } from "@/lib/api";
import { FormAlert } from "@/components/common/FormAlert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const reviewSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  comment: z.string().min(1, "Comment is required"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

type CreateReviewFormProps = {
  listingId: string;
  onSuccess?: () => void;
};

const fieldError = "text-xs text-destructive";

export function CreateReviewForm({
  listingId,
  onSuccess,
}: CreateReviewFormProps) {
  const createReview = useCreateReview();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = async (data: ReviewFormValues) => {
    try {
      await createReview.mutateAsync({
        listingId,
        rating: data.rating,
        comment: data.comment,
      });
      reset();
      onSuccess?.();
    } catch {
      // Error captured by mutation
    }
  };

  const apiError = createReview.error;
  const errorMessage =
    apiError instanceof ApiError
      ? apiError.message
      : apiError
        ? t("auth.unexpectedError")
        : null;

  const ratings = [
    { value: "5", label: `5 — ${t("reviews.excellent")}` },
    { value: "4", label: `4 — ${t("reviews.good")}` },
    { value: "3", label: `3 — ${t("reviews.average")}` },
    { value: "2", label: `2 — ${t("reviews.poor")}` },
    { value: "1", label: `1 — ${t("reviews.terrible")}` },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {errorMessage && <FormAlert message={errorMessage} />}

      <div className="space-y-1.5">
        <Label htmlFor="rating">{t("reviews.rating")}</Label>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <Select
              value={field.value ? String(field.value) : ""}
              onValueChange={(value) => field.onChange(Number(value))}
            >
              <SelectTrigger
                id="rating"
                className="w-full sm:w-64"
                aria-invalid={!!errors.rating}
              >
                <SelectValue placeholder={t("reviews.selectRating")} />
              </SelectTrigger>
              <SelectContent>
                {ratings.map((rating) => (
                  <SelectItem key={rating.value} value={rating.value}>
                    {rating.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.rating && (
          <p role="alert" className={fieldError}>
            {errors.rating.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="comment">{t("reviews.comment")}</Label>
        <Textarea
          id="comment"
          rows={3}
          {...register("comment")}
          aria-invalid={!!errors.comment}
        />
        {errors.comment && (
          <p role="alert" className={fieldError}>
            {errors.comment.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={createReview.isPending}>
        {createReview.isPending
          ? t("reviews.submitting")
          : t("reviews.submitReview")}
      </Button>
    </form>
  );
}
