import { transferAnalyticsService } from '../services/transfer-analytics.service.js';

export const getTransferAnalytics = async (req, res) => {
  try {
    const { facility_id } = req.user;
    const { timeRange } = req.query;

    const metrics = await transferAnalyticsService.getTransferMetrics(
      facility_id,
      parseInt(timeRange) || 6
    );

    res.json(metrics);
  } catch (error) {
    console.error('Transfer Analytics Error:', error);
    res.status(500).json({ error: 'Failed to fetch transfer analytics' });
  }
}; 