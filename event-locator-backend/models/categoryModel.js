const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assuming db.js exports the Sequelize instance

class Category extends Model {}

Category.init({
  name: {
    type: DataTypes.JSONB, // Store names in multiple languages as JSON
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'Category',
  timestamps: true,
});

module.exports = Category;
