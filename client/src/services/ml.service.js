import api from './api';

export const mlService = {
  async getForecast(days = 30) {
    try {
      const response = await api.get('/ml/forecast', {
        params: { days }
      });
      return response.data;
    } catch (error) {
      console.error('Forecast Error:', error);
      throw new Error('Failed to get forecast');
    }
  },

  async getStockOptimization(itemId, leadTime) {
    try {
      const response = await api.get('/ml/optimize', {
        params: {
          item_id: itemId,
          lead_time: leadTime
        }
      });
      return response.data;
    } catch (error) {
      console.error('Optimization Error:', error);
      throw new Error('Failed to get stock optimization');
    }
  },

  async getExpiryRisk() {
    try {
      const response = await api.get('/ml/risk');
      return response.data;
    } catch (error) {
      console.error('Risk Assessment Error:', error);
      throw new Error('Failed to get expiry risk assessment');
    }
  }
}; 