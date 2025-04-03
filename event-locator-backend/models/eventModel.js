const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming db.js exports the Sequelize instance

class Event extends Model {}

Event.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.GEOMETRY('POINT'), // PostGIS geometry type
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  categories: {
    type: DataTypes.ARRAY(DataTypes.INTEGER), // Assuming category IDs are integers
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.INTEGER, // Assuming user IDs are integers
    allowNull: false,
  },
  ratings: {
    type: DataTypes.JSONB, // Store ratings as JSON
  },
  favorites: {
    type: DataTypes.ARRAY(DataTypes.INTEGER), // Assuming user IDs are integers
  }
}, {
  sequelize,
  modelName: 'Event',
  timestamps: true,
});

module.exports = Event;
