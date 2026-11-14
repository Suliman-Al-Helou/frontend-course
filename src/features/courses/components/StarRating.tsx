import { Star } from "lucide-react";

export default function StarRating({ rating }: { rating: number }) {
  const formattedRating = Number(rating || 0).toFixed(1);

  return (
    <div
      role="img"
      aria-label={`التقييم: ${formattedRating} من 5 نجوم`}
      className="flex items-center gap-1"
    >
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-3.5 h-3.5 ${
              s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-muted-foreground ms-0.5" aria-hidden="true">
        {formattedRating}
      </span>
    </div>
  );
}
