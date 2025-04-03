const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: console.log
});

// Import models AFTER initializing sequelize
const User = require('../models/MUser')(sequelize);
const Event = require('../models/Event')(sequelize);

// Set up associations
User.hasMany(Event, { foreignKey: 'createdBy' });
Event.belongsTo(User, { foreignKey: 'createdBy' });

module.exports = {
  sequelize,
  User,
  Event
};