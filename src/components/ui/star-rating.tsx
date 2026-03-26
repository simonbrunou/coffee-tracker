"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  className?: string;
}

function StarRating({ value, onChange, readonly = false, className }: StarRatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      onMouseLeave={() => {
        if (!readonly) setHoverValue(null);
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={cn(
            "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm",
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"
          )}
          onClick={() => {
            if (!readonly && onChange) {
              onChange(star);
            }
          }}
          onMouseEnter={() => {
            if (!readonly) setHoverValue(star);
          }}
          aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              "h-6 w-6 transition-colors",
              star <= displayValue
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export { StarRating };
