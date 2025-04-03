// controllers/userController.js
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

class UserController {
  async register(req, res, next) {
    try {
      const user = await userService.register(req.body);
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      });
      res.status(201).json({ 
        user: { 
          id: user.id, 
          email: user.email 
        }, 
        token 
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userService.login(email, password);
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      });
      res.json({ 
        user: { 
          id: user.id, 
          email: user.email 
        }, 
        token 
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateProfile(req.user.id, req.body);
      res.json({ 
        user: { 
          id: user.id,
          email: user.email,
          locationLatitude: user.locationLatitude,
          locationLongitude: user.locationLongitude,
          preferredCategories: user.preferredCategories,
          preferredLanguage: user.preferredLanguage
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();