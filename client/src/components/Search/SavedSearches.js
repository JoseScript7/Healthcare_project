import React, { useState } from 'react';

function SavedSearches({ searches, onLoad, onSave }) {
  const [isAdding, setIsAdding] = useState(false);
  const [searchName, setSearchName] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (searchName.trim()) {
      onSave(searchName.trim());
      setSearchName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="saved-searches">
      <div className="saved-searches-header">
        <h3>Saved Searches</h3>
        <button 
          className="add-search-btn"
          onClick={() => setIsAdding(true)}
        >
          Save Current Search
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="save-search-form">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Enter search name"
            autoFocus
          />
          <div className="form-actions">
            <button type="button" onClick={() => setIsAdding(false)}>
              Cancel
            </button>
            <button type="submit" className="primary">
              Save
            </button>
          </div>
        </form>
      )}

      <div className="saved-searches-list">
        {searches.map(search => (
          <div key={search.search_id} className="saved-search-item">
            <span className="search-name">{search.name}</span>
            <button
              className="load-search-btn"
              onClick={() => onLoad(search.params)}
            >
              Load
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedSearches; 