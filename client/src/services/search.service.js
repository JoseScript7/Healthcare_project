import api from './api';

export const searchService = {
  async searchInventory(params) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/search/inventory?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Search Error:', error);
      throw new Error('Failed to search inventory');
    }
  },

  async getSavedSearches() {
    try {
      const response = await api.get('/search/saved');
      return response.data;
    } catch (error) {
      console.error('Get Saved Searches Error:', error);
      throw new Error('Failed to fetch saved searches');
    }
  },

  async saveSearch(name, params) {
    try {
      const response = await api.post('/search/save', { name, params });
      return response.data;
    } catch (error) {
      console.error('Save Search Error:', error);
      throw new Error('Failed to save search');
    }
  },

  async getSearchSuggestions(query) {
    try {
      const response = await api.get(`/search/suggestions?query=${query}`);
      return response.data;
    } catch (error) {
      console.error('Search Suggestions Error:', error);
      throw new Error('Failed to get search suggestions');
    }
  }
}; 