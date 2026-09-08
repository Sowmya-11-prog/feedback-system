import React from "react";

const RatingStars = ({ rating }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span className="star-row" aria-label={`${rating} out of 5 stars`}>
      {stars.map((s) => (
        <span key={s} className={s <= rating ? "" : "empty"}>
          ★
        </span>
      ))}
    </span>
  );
};

export default RatingStars;
