import "../styles/Stars.css";

import { Star } from "lucide-react";
import { useRef,useState } from "react";


export default function Stars( { currentRating = 0, onChange } ) {
  const [rating, setRating] = useState(currentRating);

  const streak = useRef(0);
  const prev = useRef(0);

  function updateRating(ratingClicked) {
    if (ratingClicked !== prev.current) {
      streak.current = 0;
    }
    const newRating = ratingClicked - 0.25 * (streak.current % 4);
    setRating(newRating);
    onChange(newRating);
    prev.current = ratingClicked;
    streak.current += 1;
  }

  return (
    <div className="stars-container">
      {[1, 2, 3, 4, 5].map((index) => (
        <PartialStar 
        key={index} 
        onClick={() => updateRating(index)} 
        fill={Math.max(0, Math.min(1, rating - index + 1))} />
      ))}
    </div>
  );
}

function PartialStar({ onClick, fill = 1 }) {

  const fillPercent = {
    0: 0,
    0.25: 40,
    0.5: 50,
    0.75: 60,
    1: 100,
  }[fill];

  return (
    <span className="partial-star" onClick={onClick}>
      <Star className="star-empty" />
      <span
        className="star-fill"
        style={{ width: `${fillPercent}%` }}
      >
        <Star />
      </span>
    </span>
  );
};


