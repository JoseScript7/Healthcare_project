import api from './api';

export const getInventoryItems = async (params = {}) => {
  const response = await api.get('/inventory', { params });
  return response.data;
};

export const addInventoryItem = async (itemData) => {
  const response = await api.post('/inventory', itemData);
  return response.data;
};

export const updateInventoryItem = async (id, updates) => {
  const response = await api.put(`/inventory/${id}`, updates);
  return response.data;
};

export const deleteInventoryItem = async (id) => {
  const response = await api.delete(`/inventory/${id}`);
  return response.data;
};

export const getItemStock = async (id) => {
  const response = await api.get(`/inventory/${id}/stock`);
  return response.data;
};

export const updateItemStock = async (id, stockData) => {
  const response = await api.put(`/inventory/${id}/stock`, stockData);
  return response.data;
}; 