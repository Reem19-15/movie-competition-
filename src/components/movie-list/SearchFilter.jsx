import React, { useState } from "react";

const SearchFilter = ({ onSearch, onFilter }) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");

  const handleSearch = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
    onFilter(e.target.value);
  };

  return (
    <div className="search-filter">
      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={handleSearch}
      />
      <select value={filter} onChange={handleFilter}>
        <option value="">All</option>
        <option value="popular">Popular</option>
        <option value="top_rated">Top Rated</option>
      </select>
    </div>
  );
};

export default SearchFilter;
