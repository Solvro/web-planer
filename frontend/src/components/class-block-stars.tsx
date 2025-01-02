import { StarHalfIcon, StarIcon } from "lucide-react";

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

export function StarsRating({ rating }: { rating: number }) {
  const roundedRating = customRound(rating);
  const fullPoints = Math.floor(roundedRating);
  const isHalfPoint = roundedRating % 1 === 0.5;
  return (
    <div className="flex gap-1">
      {Array.from({ length: fullPoints }).map((_, index) => {
        return (
          <StarIcon
            fill="#9e881c"
            color="#9e881c"
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            width={10}
            height={10}
          />
        );
      })}
      {isHalfPoint ? (
        <StarHalfIcon fill="#9e881c" color="#9e881c" width={10} height={10} />
      ) : null}
    </div>
  );
}
