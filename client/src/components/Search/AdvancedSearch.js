import React, { useState, useEffect } from 'react';
import { searchService } from '../../services/search.service';
import SearchFilters from './SearchFilters';
import SearchResults from './SearchResults';
import SavedSearches from './SavedSearches';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import './styles.css';

function AdvancedSearch() {
  const [searchParams, setSearchParams] = useState({
    query: '',
    category: '',
    minQuantity: '',
    maxQuantity: '',
    expiryBefore: '',
    expiryAfter: '',
    status: '',
    page: 1,
    limit: 10
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedSearches, setSavedSearches] = useState([]);

  useEffect(() => {
    loadSavedSearches();
  }, []);

  useEffect(() => {
    if (searchParams.query || searchParams.category) {
      performSearch();
    }
  }, [searchParams.page]);

  const loadSavedSearches = async () => {
    try {
      const searches = await searchService.getSavedSearches();
      setSavedSearches(searches);
    } catch (error) {
      console.error('Load Saved Searches Error:', error);
    }
  };

  const performSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchService.searchInventory(searchParams);
      setResults(data);
    } catch (error) {
      setError('Failed to perform search');
      console.error('Search Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newParams) => {
    setSearchParams({ ...searchParams, ...newParams, page: 1 });
    performSearch();
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ ...searchParams, page: newPage });
  };

  const handleSaveSearch = async (name) => {
    try {
      await searchService.saveSearch(name, searchParams);
      loadSavedSearches();
    } catch (error) {
      console.error('Save Search Error:', error);
    }
  };

  const loadSavedSearch = (params) => {
    setSearchParams({ ...params, page: 1 });
    performSearch();
  };

  return (
    <div className="advanced-search">
      <div className="search-container">
        <div className="search-sidebar">
          <SearchFilters
            params={searchParams}
            onSearch={handleSearch}
          />
          <SavedSearches
            searches={savedSearches}
            onLoad={loadSavedSearch}
            onSave={handleSaveSearch}
          />
        </div>

        <div className="search-content">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} onRetry={performSearch} />
          ) : (
            <SearchResults
              results={results}
              onPageChange={handlePageChange}
              currentPage={searchParams.page}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdvancedSearch; 