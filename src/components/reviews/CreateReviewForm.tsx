"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateReview } from "@/hooks/useReviews";
import { ApiError } from "@/lib/api";

const reviewSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  comment: z.string().min(1, "Comment is required"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

type CreateReviewFormProps = {
  listingId: string;
  onSuccess?: () => void;
};

export function CreateReviewForm({
  listingId,
  onSuccess,
}: CreateReviewFormProps) {
  const createReview = useCreateReview();

  const {
    register,
    handleSubmit,
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
        ? "An unexpected error occurred."
        : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {errorMessage && (
        <div
          role="alert"
          className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm"
        >
          {errorMessage}
        </div>
      )}

      <div>
        <label
          htmlFor="rating"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Rating
        </label>
        <select
          id="rating"
          {...register("rating", { valueAsNumber: true })}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-invalid={!!errors.rating}
        >
          <option value="">Select rating</option>
          <option value="5">5 — Excellent</option>
          <option value="4">4 — Good</option>
          <option value="3">3 — Average</option>
          <option value="2">2 — Poor</option>
          <option value="1">1 — Terrible</option>
        </select>
        {errors.rating && (
          <p role="alert" className="mt-1 text-xs text-red-600">
            {errors.rating.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Comment
        </label>
        <textarea
          id="comment"
          rows={3}
          {...register("comment")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-invalid={!!errors.comment}
        />
        {errors.comment && (
          <p role="alert" className="mt-1 text-xs text-red-600">
            {errors.comment.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={createReview.isPending}
        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {createReview.isPending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
