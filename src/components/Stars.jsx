import { Star } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import "../styles/Stars.css";



export default function Stars() {
  const [rating, setRating] = useState(0);

  const streak = useRef(0);
  const prev = useRef(0);
  function updateRating(ratingClicked) {
    if (ratingClicked !== prev.current) {
      streak.current = 0;
    }

    const newRating = ratingClicked - 0.25 * (streak.current % 4);

    setRating(newRating);
    prev.current = ratingClicked;
    streak.current += 1;
    console.log(rating)
  }

  return (
    <>
      {[1, 2, 3, 4, 5].map((index) => (
        <PartialStar key={index} onClick={() => updateRating(index)} fill={1} />
      ))}
    </>
  );
}

function PartialStar({ onClick, fill = 1 }) {
  return (
    <span className="partial-star" onClick={onClick}>
      <Star className="star-empty" />
      <span
        className="star-fill"
        style={{ width: `${fill * 100}%` }}
      >
        <Star />
      </span>
    </span>
  );
};


