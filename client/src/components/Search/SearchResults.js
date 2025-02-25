import React from 'react';
import { format } from 'date-fns';
import Pagination from '../common/Pagination';

function SearchResults({ results, onPageChange, currentPage }) {
  if (!results || !results.items.length) {
    return (
      <div className="no-results">
        <p>No items found matching your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="results-header">
        <h3>Search Results</h3>
        <span className="results-count">
          {results.total} items found
        </span>
      </div>

      <div className="results-grid">
        {results.items.map(item => (
          <div key={item.item_id} className="result-card">
            <div className="result-header">
              <h4>{item.InventoryItem.name}</h4>
              <span className={`status-badge ${item.status}`}>
                {item.status}
              </span>
            </div>

            <div className="result-details">
              <p>SKU: {item.InventoryItem.sku}</p>
              <p>Category: {item.InventoryItem.category}</p>
              <p>Quantity: {item.quantity}</p>
              {item.expiry_date && (
                <p>Expires: {format(new Date(item.expiry_date), 'MMM dd, yyyy')}</p>
              )}
            </div>

            <div className="result-facility">
              <p>Facility: {item.Facility.name}</p>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={results.totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export default SearchResults; 