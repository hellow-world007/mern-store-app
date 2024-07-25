import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ priceRange, setPriceRange }) => {
  const handleSliderChange = (event) => {
    setPriceRange(event.target.value);
  };

  return (
    <div className="progressBar">
      <input
        type="range"
        min="0"
        max="10000"
        value={priceRange}
        onChange={handleSliderChange}
      />
      <p>$1 - ${priceRange}</p>
    </div>
  );
};

export default ProgressBar;
