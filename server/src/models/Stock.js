import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Stock = sequelize.define('Stock', {
  stock_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  item_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  facility_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  batch_number: {
    type: DataTypes.STRING
  },
  expiry_date: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['facility_id'] },
    { fields: ['item_id'] },
    { fields: ['expiry_date'] }
  ]
});

export default Stock; 