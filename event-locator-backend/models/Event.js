const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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
    // Using separate latitude/longitude columns (recommended)
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { 
        min: -90, 
        max: 90 
      }
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { 
        min: -180, 
        max: 180 
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    categories: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ratings: {
      type: DataTypes.JSONB,
    },
    favorites: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
    }
  }, {
    sequelize,
    modelName: 'Event',
    timestamps: true,
  });

  return Event;
};