import { Facility, User, Stock } from '../models/index.js';
import { Op } from 'sequelize';

export const getFacilities = async (query = {}) => {
  const where = {};
  
  if (query.type) {
    where.type = query.type;
  }
  
  if (query.status) {
    where.status = query.status;
  }
  
  if (query.search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${query.search}%` } },
      { location: { [Op.iLike]: `%${query.search}%` } }
    ];
  }

  const facilities = await Facility.findAll({
    where,
    include: [{
      model: Stock,
      attributes: ['item_id', 'quantity']
    }],
    order: [['name', 'ASC']]
  });

  return facilities;
};

export const getFacilityById = async (id) => {
  const facility = await Facility.findByPk(id, {
    include: [{
      model: User,
      attributes: ['user_id', 'email', 'role']
    }, {
      model: Stock,
      attributes: ['item_id', 'quantity', 'expiry_date']
    }]
  });

  if (!facility) {
    throw new Error('Facility not found');
  }

  return facility;
};

export const createFacility = async (facilityData) => {
  const facility = await Facility.create(facilityData);
  return facility;
};

export const updateFacility = async (id, updates) => {
  const facility = await Facility.findByPk(id);
  
  if (!facility) {
    throw new Error('Facility not found');
  }

  await facility.update(updates);
  return facility;
};

export const deleteFacility = async (id) => {
  const facility = await Facility.findByPk(id);
  
  if (!facility) {
    throw new Error('Facility not found');
  }

  // Check if facility has any users or stock
  const hasUsers = await User.count({ where: { facility_id: id } });
  const hasStock = await Stock.count({ where: { facility_id: id } });

  if (hasUsers || hasStock) {
    throw new Error('Cannot delete facility with active users or stock');
  }

  await facility.destroy();
}; 