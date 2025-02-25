import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SavedSearch = sequelize.define('SavedSearch', {
  search_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'user_id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  params: {
    type: DataTypes.JSONB,
    allowNull: false
  }
}, {
  timestamps: true,
  underscored: true
});

export default SavedSearch; 