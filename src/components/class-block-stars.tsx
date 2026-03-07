import { cn } from "@/lib/utils";

import { Icons } from "./icons";

function customRound(rating: number): number {
  const integerPart = Math.floor(rating);
  const decimalPart = rating - integerPart;
  if (decimalPart > 0.7) {
    return integerPart + 1;
  } else if (decimalPart >= 0.3) {
    return integerPart + 0.5;
  } else {
    return integerPart;
  }
}
export function StarsRating({
  rating,
  hideStars = false,
}: {
  rating: number;
  hideStars?: boolean;
}) {
  const roundedRating = customRound(rating);
  const fullPoints = Math.floor(roundedRating);
  const isHalfPoint = roundedRating % 1 === 0.5;
  return (
    <div className={cn("flex gap-1", { hidden: hideStars })}>
      {Array.from({ length: fullPoints }).map((_, index) => {
        return (
          <Icons.Star
            fill="#ffe605"
            color="#cf9013"
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            width={10}
            height={10}
          />
        );
      })}
      {isHalfPoint ? (
        <Icons.StarHalf fill="#ffe605" color="#cf9013" width={10} height={10} />
      ) : null}
    </div>
  );
}
