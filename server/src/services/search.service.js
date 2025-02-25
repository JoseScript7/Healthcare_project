import { Op } from 'sequelize';
import { Stock, InventoryItem, Facility, User } from '../models/index.js';

export const searchService = {
  async searchInventory(params, facilityId) {
    const {
      query,
      category,
      minQuantity,
      maxQuantity,
      expiryBefore,
      expiryAfter,
      status,
      sortBy = 'name',
      sortOrder = 'ASC',
      page = 1,
      limit = 10
    } = params;

    const where = {};
    const itemWhere = {};

    // Basic search
    if (query) {
      itemWhere[Op.or] = [
        { name: { [Op.iLike]: `%${query}%` } },
        { sku: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } }
      ];
    }

    // Category filter
    if (category) {
      itemWhere.category = category;
    }

    // Quantity range
    if (minQuantity !== undefined) {
      where.quantity = { [Op.gte]: minQuantity };
    }
    if (maxQuantity !== undefined) {
      where.quantity = { ...where.quantity, [Op.lte]: maxQuantity };
    }

    // Expiry date range
    if (expiryBefore || expiryAfter) {
      where.expiry_date = {};
      if (expiryBefore) {
        where.expiry_date[Op.lte] = new Date(expiryBefore);
      }
      if (expiryAfter) {
        where.expiry_date[Op.gte] = new Date(expiryAfter);
      }
    }

    // Status filter
    if (status) {
      where.status = status;
    }

    // Facility filter
    if (facilityId) {
      where.facility_id = facilityId;
    }

    // Execute search with pagination
    const offset = (page - 1) * limit;
    const { count, rows } = await Stock.findAndCountAll({
      where,
      include: [
        {
          model: InventoryItem,
          where: itemWhere,
          attributes: ['item_id', 'name', 'sku', 'category', 'description']
        },
        {
          model: Facility,
          attributes: ['facility_id', 'name']
        }
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset
    });

    return {
      items: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  },

  async getSavedSearches(userId) {
    return await SavedSearch.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });
  },

  async saveSearch(userId, searchParams, name) {
    return await SavedSearch.create({
      user_id: userId,
      name,
      params: searchParams
    });
  },

  async getSearchSuggestions(query) {
    const items = await InventoryItem.findAll({
      where: {
        name: { [Op.iLike]: `%${query}%` }
      },
      attributes: ['name'],
      limit: 5
    });

    return items.map(item => item.name);
  }
}; 