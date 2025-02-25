import { Op } from 'sequelize';
import { InventoryItem, Stock, Facility } from '../models/index.js';

export const getItems = async ({ category, search, expiry }) => {
  const where = {};
  
  if (category) {
    where.category = category;
  }
  
  if (search) {
    where.name = { [Op.iLike]: `%${search}%` };
  }

  const items = await InventoryItem.findAll({
    where,
    include: [{
      model: Stock,
      include: [{
        model: Facility,
        attributes: ['name', 'type']
      }],
      where: expiry ? {
        expiry_date: {
          [Op.lte]: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      } : undefined
    }]
  });

  return items;
};

export const createItem = async (itemData) => {
  const item = await InventoryItem.create(itemData);
  return item;
};

export const updateItem = async (id, updates) => {
  const item = await InventoryItem.findByPk(id);
  if (!item) {
    throw new Error('Item not found');
  }
  
  await item.update(updates);
  return item;
};

export const deleteItem = async (id) => {
  const item = await InventoryItem.findByPk(id);
  if (!item) {
    throw new Error('Item not found');
  }
  
  await item.destroy();
};

export const getItemStock = async (itemId) => {
  const stock = await Stock.findAll({
    where: { item_id: itemId },
    include: [{
      model: Facility,
      attributes: ['name', 'type', 'location']
    }]
  });
  
  return stock;
};

export const updateStock = async (itemId, stockData) => {
  const [stock, created] = await Stock.findOrCreate({
    where: {
      item_id: itemId,
      facility_id: stockData.facility_id
    },
    defaults: stockData
  });

  if (!created) {
    await stock.update(stockData);
  }

  return stock;
}; 