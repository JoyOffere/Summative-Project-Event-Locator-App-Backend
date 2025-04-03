const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Assuming db.js exports the Sequelize instance
const bcrypt = require('bcrypt');

class User extends Model {
  // Method to compare passwords
  async matchPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    lowercase: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.GEOMETRY('POINT'), // PostGIS geometry type
    allowNull: false,
  },
  preferredCategories: {
    type: DataTypes.ARRAY(DataTypes.INTEGER), // Assuming category IDs are integers
  },
  preferredLanguage: {
    type: DataTypes.STRING,
    defaultValue: 'en',
  }
}, {
  sequelize,
  modelName: 'User',
  timestamps: true,
});

// Hash password before saving
User.beforeSave(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

module.exports = User;
