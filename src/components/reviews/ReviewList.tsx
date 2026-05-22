"use client";

import { useReviews, useDeleteReview } from "@/hooks/useReviews";
import { useAuth } from "@/hooks/useAuth";
import { StarRating } from "@/components/reviews/StarRating";

type ReviewListProps = {
  listingId?: string;
};

export function ReviewList({ listingId }: ReviewListProps) {
  const { user } = useAuth();
  const { data: reviews, isLoading, error } = useReviews(listingId);
  const deleteReview = useDeleteReview();

  if (isLoading) return <p className="text-gray-500">Loading reviews...</p>;

  if (error) {
    return (
      <div
        role="alert"
        className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700"
      >
        Failed to load reviews.
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return <p className="text-gray-500">No reviews yet.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border border-gray-200 rounded-lg p-4 bg-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} />
                <span className="text-sm font-medium text-gray-900">
                  {review.reviewerName}
                </span>
              </div>
              {!listingId && (
                <p className="text-xs text-gray-500 mt-1">
                  {review.listingTitle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
              {user?.id === review.reviewerId && (
                <button
                  onClick={() => deleteReview.mutate(review.id)}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
