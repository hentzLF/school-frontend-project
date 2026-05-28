"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { REVIEW_ROUTES } from "@/config/constants";
import type { Review, CreateReviewRequest } from "@/types/review";

export function useReviews(listingId?: string) {
  const params = listingId ? `?listingId=${listingId}` : "";

  return useQuery<Review[]>({
    queryKey: ["reviews", listingId],
    queryFn: () => api<Review[]>(`${REVIEW_ROUTES.list}${params}`),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation<Review, Error, CreateReviewRequest>({
    mutationFn: (data) =>
      api<Review>(REVIEW_ROUTES.list, { method: "POST", body: data }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      api<void>(REVIEW_ROUTES.detail(id), { method: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
