export type Review = {
  id: string;
  listingId: string;
  listingTitle: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateReviewRequest = {
  listingId: string;
  rating: number;
  comment: string;
};

export type UpdateReviewRequest = {
  rating?: number;
  comment?: string;
};
