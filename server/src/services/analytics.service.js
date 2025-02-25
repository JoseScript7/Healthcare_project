import { Stock, Transaction, InventoryItem, Facility } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

export const getFacilityStockAnalytics = async (facilityId) => {
  const stockAnalytics = await Stock.findAll({
    where: { facility_id: facilityId },
    include: [{
      model: InventoryItem,
      attributes: ['name', 'category']
    }],
    attributes: [
      'item_id',
      'quantity',
      'expiry_date',
      [sequelize.fn('COUNT', sequelize.col('stock_id')), 'total_batches']
    ],
    group: ['item_id', 'Stock.stock_id', 'InventoryItem.item_id']
  });

  return stockAnalytics;
};

export const getStockMovementAnalytics = async (facilityId, timeframe = '30') => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(timeframe));

  const movements = await Transaction.findAll({
    where: {
      [Op.or]: [
        { from_facility_id: facilityId },
        { to_facility_id: facilityId }
      ],
      created_at: {
        [Op.gte]: startDate
      }
    },
    include: [
      {
        model: InventoryItem,
        attributes: ['name', 'category']
      },
      {
        model: Facility,
        as: 'FromFacility',
        attributes: ['name']
      },
      {
        model: Facility,
        as: 'ToFacility',
        attributes: ['name']
      }
    ],
    order: [['created_at', 'DESC']]
  });

  return movements;
};

export const getLowStockItems = async (facilityId) => {
  const lowStockItems = await Stock.findAll({
    where: {
      facility_id: facilityId,
      quantity: {
        [Op.lt]: sequelize.literal('minimum_quantity')
      }
    },
    include: [{
      model: InventoryItem,
      attributes: ['name', 'category', 'unit']
    }]
  });

  return lowStockItems;
};

export const getExpiryAnalytics = async (facilityId, daysThreshold = 90) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + daysThreshold);

  const expiringItems = await Stock.findAll({
    where: {
      facility_id: facilityId,
      expiry_date: {
        [Op.lte]: expiryDate
      }
    },
    include: [{
      model: InventoryItem,
      attributes: ['name', 'category']
    }],
    order: [['expiry_date', 'ASC']]
  });

  return expiringItems;
};

export const getStockUtilizationRate = async (facilityId, timeframe = '30') => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(timeframe));

  const transactions = await Transaction.findAll({
    where: {
      from_facility_id: facilityId,
      created_at: {
        [Op.gte]: startDate
      }
    },
    attributes: [
      'item_id',
      [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity']
    ],
    include: [{
      model: InventoryItem,
      attributes: ['name', 'category']
    }],
    group: ['item_id', 'InventoryItem.item_id']
  });

  return transactions;
}; 