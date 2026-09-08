import React from "react";

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="text"
      className="search-input"
      placeholder={placeholder || "Search..."}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchBar;
