import { searchService } from '../services/search.service.js';

export const searchInventory = async (req, res) => {
  try {
    const { facility_id } = req.user;
    const searchResults = await searchService.searchInventory(req.query, facility_id);
    res.json(searchResults);
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ error: 'Failed to search inventory' });
  }
};

export const getSavedSearches = async (req, res) => {
  try {
    const searches = await searchService.getSavedSearches(req.user.user_id);
    res.json(searches);
  } catch (error) {
    console.error('Get Saved Searches Error:', error);
    res.status(500).json({ error: 'Failed to fetch saved searches' });
  }
};

export const saveSearch = async (req, res) => {
  try {
    const { name, params } = req.body;
    const savedSearch = await searchService.saveSearch(req.user.user_id, params, name);
    res.status(201).json(savedSearch);
  } catch (error) {
    console.error('Save Search Error:', error);
    res.status(500).json({ error: 'Failed to save search' });
  }
};

export const getSearchSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    const suggestions = await searchService.getSearchSuggestions(query);
    res.json(suggestions);
  } catch (error) {
    console.error('Search Suggestions Error:', error);
    res.status(500).json({ error: 'Failed to get search suggestions' });
  }
}; 