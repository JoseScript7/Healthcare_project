import User from './User.js';
import Facility from './Facility.js';
import InventoryItem from './InventoryItem.js';
import Stock from './Stock.js';
import Transaction from './Transaction.js';

// User - Facility Association
User.belongsTo(Facility, { foreignKey: 'facility_id' });
Facility.hasMany(User, { foreignKey: 'facility_id' });

// Stock Associations
Stock.belongsTo(InventoryItem, { foreignKey: 'item_id' });
Stock.belongsTo(Facility, { foreignKey: 'facility_id' });
InventoryItem.hasMany(Stock, { foreignKey: 'item_id' });
Facility.hasMany(Stock, { foreignKey: 'facility_id' });

// Transaction Associations
Transaction.belongsTo(Facility, { as: 'FromFacility', foreignKey: 'from_facility_id' });
Transaction.belongsTo(Facility, { as: 'ToFacility', foreignKey: 'to_facility_id' });
Transaction.belongsTo(InventoryItem, { foreignKey: 'item_id' });

export {
  User,
  Facility,
  InventoryItem,
  Stock,
  Transaction
}; 