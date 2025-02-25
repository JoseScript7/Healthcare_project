import { mlService } from '../services/ml.service.js';
import { Stock, Transaction } from '../models/index.js';

export const getInventoryForecast = async (req, res) => {
  try {
    const { facility_id } = req.user;
    const { days = 30 } = req.query;

    // Get historical data
    const historicalData = await Transaction.findAll({
      where: { facility_id },
      order: [['created_at', 'DESC']],
      limit: 365 // Last year of data
    });

    // Generate future dates
    const futureDates = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date.toISOString().split('T')[0];
    });

    const forecast = await mlService.getForecast(historicalData, futureDates);
    res.json(forecast);
  } catch (error) {
    console.error('Forecast Error:', error);
    res.status(500).json({ error: 'Failed to generate forecast' });
  }
};

export const getStockOptimization = async (req, res) => {
  try {
    const { facility_id } = req.user;
    const { item_id, lead_time } = req.query;

    // Get current stock levels
    const stock = await Stock.findOne({
      where: { facility_id, item_id }
    });

    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    const optimization = await mlService.optimizeStock(
      stock.quantity,
      lead_time,
      0.95
    );

    res.json(optimization);
  } catch (error) {
    console.error('Optimization Error:', error);
    res.status(500).json({ error: 'Failed to optimize stock' });
  }
};

export const getExpiryRisk = async (req, res) => {
  try {
    const { facility_id } = req.user;

    // Get current inventory with expiry dates
    const inventory = await Stock.findAll({
      where: { facility_id },
      include: ['InventoryItem']
    });

    const riskAssessment = await mlService.assessExpiryRisk(inventory);
    res.json(riskAssessment);
  } catch (error) {
    console.error('Risk Assessment Error:', error);
    res.status(500).json({ error: 'Failed to assess expiry risk' });
  }
}; 