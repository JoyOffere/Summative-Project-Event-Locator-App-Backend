const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {
    async comparePassword(candidatePassword) {
      return await bcrypt.compare(candidatePassword, this.password);
    }
  }

  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Consistent with Event model approach
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: { min: -90, max: 90 }
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: { min: -180, max: 180 }
    },
    preferredCategories: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    },
    preferredLanguage: {
      type: DataTypes.STRING,
      defaultValue: 'en'
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  return User;
};