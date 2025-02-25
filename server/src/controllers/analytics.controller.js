import {
  getFacilityStockAnalytics,
  getStockMovementAnalytics,
  getLowStockItems,
  getExpiryAnalytics,
  getStockUtilizationRate
} from '../services/analytics.service.js';

export const getAnalytics = async (req, res) => {
  try {
    const { facility_id } = req.user;
    const { timeframe } = req.query;

    const [
      stockAnalytics,
      movements,
      lowStock,
      expiringItems,
      utilization
    ] = await Promise.all([
      getFacilityStockAnalytics(facility_id),
      getStockMovementAnalytics(facility_id, timeframe),
      getLowStockItems(facility_id),
      getExpiryAnalytics(facility_id),
      getStockUtilizationRate(facility_id, timeframe)
    ]);

    res.status(200).json({
      stock: stockAnalytics,
      movements,
      lowStock,
      expiringItems,
      utilization
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

export const getStockMovements = async (req, res) => {
  try {
    const { facility_id } = req.user;
    const { timeframe } = req.query;

    const movements = await getStockMovementAnalytics(facility_id, timeframe);
    res.status(200).json(movements);
  } catch (error) {
    console.error('Stock Movements Error:', error);
    res.status(500).json({ error: 'Failed to fetch stock movements' });
  }
};

export const getLowStock = async (req, res) => {
  try {
    const { facility_id } = req.user;
    const items = await getLowStockItems(facility_id);
    res.status(200).json(items);
  } catch (error) {
    console.error('Low Stock Error:', error);
    res.status(500).json({ error: 'Failed to fetch low stock items' });
  }
};

export const getExpiring = async (req, res) => {
  try {
    const { facility_id } = req.user;
    const { days } = req.query;

    const items = await getExpiryAnalytics(facility_id, days);
    res.status(200).json(items);
  } catch (error) {
    console.error('Expiry Analytics Error:', error);
    res.status(500).json({ error: 'Failed to fetch expiring items' });
  }
}; 