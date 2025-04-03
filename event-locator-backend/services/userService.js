// services/userService.js
const { User } = require('../config/database');
const createError = require('http-errors');

class UserService {
  async register(userData) {
    const { email, password, locationLatitude, locationLongitude, preferredCategories } = userData;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw createError(400, 'Email already registered');
    }

    return await User.create({
      email,
      password,
      locationLatitude,
      locationLongitude,
      preferredCategories
    });
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw createError(401, 'Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw createError(401, 'Invalid credentials');
    }

    return user;
  }

  async updateProfile(userId, updateData) {
    const allowedUpdates = ['locationLatitude', 'locationLongitude', 'preferredCategories', 'preferredLanguage'];
    const updates = Object.keys(updateData)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    const [updatedRows] = await User.update(updates, {
      where: { id: userId },
      returning: true
    });

    if (updatedRows === 0) {
      throw createError(404, 'User not found');
    }

    return await User.findByPk(userId);
  }
}

module.exports = new UserService();