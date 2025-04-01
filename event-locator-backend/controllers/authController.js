const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register user
const registerUser = async (req, res) => {
  try {
    const { username, email, password, location, preferredCategories, preferredLanguage } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      },
      preferredCategories,
      preferredLanguage: preferredLanguage || 'en'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        location: user.location,
        preferredCategories: user.preferredCategories,
        preferredLanguage: user.preferredLanguage,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        location: user.location,
        preferredCategories: user.preferredCategories,
        preferredLanguage: user.preferredLanguage,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('preferredCategories');

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        location: user.location,
        preferredCategories: user.preferredCategories,
        preferredLanguage: user.preferredLanguage
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      if (req.body.location) {
        user.location = {
          type: 'Point',
          coordinates: [req.body.location.longitude, req.body.location.latitude]
        };
      }
      
      if (req.body.preferredCategories) {
        user.preferredCategories = req.body.preferredCategories;
      }
      
      if (req.body.preferredLanguage) {
        user.preferredLanguage = req.body.preferredLanguage;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        location: updatedUser.location,
        preferredCategories: updatedUser.preferredCategories,
        preferredLanguage: updatedUser.preferredLanguage,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};