import api from './api';

export const getAnalytics = async (timeframe) => {
  const response = await api.get('/analytics', { params: { timeframe } });
  return response.data;
};

export const getStockMovements = async (timeframe) => {
  const response = await api.get('/analytics/movements', { params: { timeframe } });
  return response.data;
};

export const getLowStock = async () => {
  const response = await api.get('/analytics/low-stock');
  return response.data;
};

export const getExpiring = async (days) => {
  const response = await api.get('/analytics/expiring', { params: { days } });
  return response.data;
}; 