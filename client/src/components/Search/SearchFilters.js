import React, { useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

function SearchFilters({ params, onSearch }) {
  const [filters, setFilters] = useState(params);
  const debouncedSearch = useDebounce(onSearch, 500);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    debouncedSearch(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      query: '',
      category: '',
      minQuantity: '',
      maxQuantity: '',
      expiryBefore: '',
      expiryAfter: '',
      status: '',
      page: 1
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  return (
    <div className="search-filters">
      <h3>Search Filters</h3>
      
      <div className="filter-group">
        <input
          type="text"
          name="query"
          value={filters.query}
          onChange={handleChange}
          placeholder="Search items..."
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <label>Category</label>
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">All Categories</option>
          <option value="medicines">Medicines</option>
          <option value="supplies">Supplies</option>
          <option value="equipment">Equipment</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Quantity Range</label>
        <div className="range-inputs">
          <input
            type="number"
            name="minQuantity"
            value={filters.minQuantity}
            onChange={handleChange}
            placeholder="Min"
            min="0"
          />
          <input
            type="number"
            name="maxQuantity"
            value={filters.maxQuantity}
            onChange={handleChange}
            placeholder="Max"
            min="0"
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Expiry Date Range</label>
        <input
          type="date"
          name="expiryAfter"
          value={filters.expiryAfter}
          onChange={handleChange}
        />
        <input
          type="date"
          name="expiryBefore"
          value={filters.expiryBefore}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label>Status</label>
        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">All Status</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>

      <button className="reset-btn" onClick={handleReset}>
        Reset Filters
      </button>
    </div>
  );
}

export default SearchFilters; 