import { Transfer, Facility, InventoryItem, User } from '../models/index.js';
import { Op, Sequelize } from 'sequelize';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export const transferAnalyticsService = {
  async getTransferMetrics(facilityId, timeRange = 6) { // timeRange in months
    const endDate = new Date();
    const startDate = subMonths(endDate, timeRange);

    const transfers = await Transfer.findAll({
      where: {
        [Op.or]: [
          { from_facility_id: facilityId },
          { to_facility_id: facilityId }
        ],
        created_at: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [
        { model: InventoryItem },
        { model: Facility, as: 'FromFacility' },
        { model: Facility, as: 'ToFacility' }
      ]
    });

    // Calculate metrics
    const metrics = {
      totalTransfers: transfers.length,
      incomingTransfers: transfers.filter(t => t.to_facility_id === facilityId).length,
      outgoingTransfers: transfers.filter(t => t.from_facility_id === facilityId).length,
      averageProcessingTime: this.calculateAverageProcessingTime(transfers),
      statusDistribution: this.calculateStatusDistribution(transfers),
      monthlyTrends: await this.calculateMonthlyTrends(facilityId, timeRange),
      topItems: this.calculateTopItems(transfers),
      topPartners: this.calculateTopPartners(transfers, facilityId)
    };

    return metrics;
  },

  calculateAverageProcessingTime(transfers) {
    const completedTransfers = transfers.filter(t => t.status === 'completed');
    if (completedTransfers.length === 0) return 0;

    const totalTime = completedTransfers.reduce((sum, transfer) => {
      const start = new Date(transfer.created_at);
      const end = new Date(transfer.updated_at);
      return sum + (end - start);
    }, 0);

    return totalTime / completedTransfers.length / (1000 * 60 * 60); // Convert to hours
  },

  calculateStatusDistribution(transfers) {
    return transfers.reduce((acc, transfer) => {
      acc[transfer.status] = (acc[transfer.status] || 0) + 1;
      return acc;
    }, {});
  },

  async calculateMonthlyTrends(facilityId, timeRange) {
    const months = [];
    for (let i = 0; i < timeRange; i++) {
      const date = subMonths(new Date(), i);
      const start = startOfMonth(date);
      const end = endOfMonth(date);

      const monthlyTransfers = await Transfer.count({
        where: {
          [Op.or]: [
            { from_facility_id: facilityId },
            { to_facility_id: facilityId }
          ],
          created_at: {
            [Op.between]: [start, end]
          }
        }
      });

      months.unshift({
        month: start.toISOString().slice(0, 7),
        count: monthlyTransfers
      });
    }
    return months;
  },

  calculateTopItems(transfers) {
    const itemCounts = transfers.reduce((acc, transfer) => {
      const itemId = transfer.item_id;
      const itemName = transfer.InventoryItem.name;
      acc[itemId] = acc[itemId] || { name: itemName, count: 0 };
      acc[itemId].count += 1;
      return acc;
    }, {});

    return Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  },

  calculateTopPartners(transfers, facilityId) {
    const partnerCounts = transfers.reduce((acc, transfer) => {
      const partnerId = transfer.from_facility_id === facilityId
        ? transfer.to_facility_id
        : transfer.from_facility_id;
      const partnerName = transfer.from_facility_id === facilityId
        ? transfer.ToFacility.name
        : transfer.FromFacility.name;
      
      acc[partnerId] = acc[partnerId] || { name: partnerName, count: 0 };
      acc[partnerId].count += 1;
      return acc;
    }, {});

    return Object.values(partnerCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}; 