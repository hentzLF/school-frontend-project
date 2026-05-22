type StarRatingProps = {
  rating: number;
  max?: number;
};

export function StarRating({ rating, max = 5 }: StarRatingProps) {
  return (
    <div
      className="flex items-center"
      aria-label={`${rating} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`text-base leading-none ${
            i < rating ? "text-yellow-400" : "text-muted-foreground/30"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}
