import axios from 'axios';
import config from '../config/config.js';

const ML_SERVICE_URL = config.ml.serviceUrl || 'http://localhost:5001/api/ml';

export const mlService = {
  async getForecast(historicalData, futureDates) {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/forecast`, {
        historical_data: historicalData,
        future_dates: futureDates
      });
      return response.data;
    } catch (error) {
      console.error('ML Forecast Error:', error);
      throw new Error('Failed to get demand forecast');
    }
  },

  async optimizeStock(forecast, leadTime, serviceLevel = 0.95) {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/optimize`, {
        forecast,
        lead_time: leadTime,
        service_level: serviceLevel
      });
      return response.data;
    } catch (error) {
      console.error('ML Optimization Error:', error);
      throw new Error('Failed to optimize stock levels');
    }
  },

  async assessExpiryRisk(inventory) {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/risk`, {
        inventory
      });
      return response.data;
    } catch (error) {
      console.error('ML Risk Assessment Error:', error);
      throw new Error('Failed to assess expiry risk');
    }
  }
}; 