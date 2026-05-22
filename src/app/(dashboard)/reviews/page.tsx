import { ReviewList } from "@/components/reviews/ReviewList";

export default function ReviewsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h1>
      <ReviewList />
    </div>
  );
}
