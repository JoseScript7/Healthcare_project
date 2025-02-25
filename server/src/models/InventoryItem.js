import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const InventoryItem = sequelize.define('InventoryItem', {
  item_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  unit: {
    type: DataTypes.STRING
  }
});

export default InventoryItem; 