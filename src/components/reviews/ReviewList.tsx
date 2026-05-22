"use client";

import { Star, Trash2 } from "lucide-react";
import { useReviews, useDeleteReview } from "@/hooks/useReviews";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { StarRating } from "@/components/reviews/StarRating";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ReviewListProps = {
  listingId?: string;
};

export function ReviewList({ listingId }: ReviewListProps) {
  const { user } = useAuth();
  const { data: reviews, isLoading, error } = useReviews(listingId);
  const deleteReview = useDeleteReview();
  const { t } = useTranslation();

  let content: React.ReactNode;

  if (isLoading) {
    content = <LoadingState label={t("common.loading")} />;
  } else if (error) {
    content = <ErrorState message={t("reviews.loadError")} />;
  } else if (!reviews || reviews.length === 0) {
    content = <EmptyState icon={Star} title={t("reviews.noReviews")} />;
  } else {
    content = (
      <div className="space-y-3">
        {reviews.map((review) => (
          <Card key={review.id} size="sm">
            <CardContent className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} />
                    <span className="text-sm font-medium text-foreground">
                      {review.reviewerName}
                    </span>
                  </div>
                  {!listingId && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {review.listingTitle}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                  {user?.id === review.reviewerId && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => deleteReview.mutate(review.id)}
                      aria-label={t("common.delete")}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-sm text-foreground/90">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      {!listingId && <PageHeader title={t("reviews.title")} />}
      {content}
    </div>
  );
}
