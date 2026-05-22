type StarRatingProps = {
  rating: number;
  max?: number;
};

export function StarRating({ rating, max = 5 }: StarRatingProps) {
  return (
    <div className="flex" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`text-sm ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}
