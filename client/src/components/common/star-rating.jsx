import React from "react";
import { Button } from "../ui/button";
import { StarIcon } from "lucide-react";

export default function StarRatingComponent({ rating, handleRatingChange }) {
  return [1, 2, 3, 4, 5].map((star, i) => (
    <Button
      className={`rounded-full p-2 transition-colors ${star <= rating ? "text-yellow-500 hover:bg-foreground hover:text-yellow-500" : "text-black hover:bg-primary hover:text-primary-foreground"}`}
      variant="outline"
      size="icon"
      key={i}
      onClick={() => (handleRatingChange ? handleRatingChange(star) : null)}
    >
      <StarIcon
        className={`h-6 w-6 ${star <= rating ? "fill-yellow-500" : ""}`}
      />
    </Button>
  ));
}
