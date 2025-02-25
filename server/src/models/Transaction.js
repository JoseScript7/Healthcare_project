import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Transaction = sequelize.define('Transaction', {
  transaction_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  from_facility_id: {
    type: DataTypes.UUID
  },
  to_facility_id: {
    type: DataTypes.UUID
  },
  item_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  transaction_type: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.STRING
  }
});

export default Transaction; 