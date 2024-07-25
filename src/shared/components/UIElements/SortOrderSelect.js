import React from 'react';
import './SortOrderSelect.css';

const SortOrderSelect = ({ sortOrder, handleSortOrderChange }) => {
  return (
    <div className="options">
      <select value={sortOrder} onChange={handleSortOrderChange}>
      <option value="asc">Newest First</option>
        <option value="asc">Price low to high</option>
        <option value="desc">Price high to low</option>
      </select>
    </div>
  );
};

export default SortOrderSelect;
