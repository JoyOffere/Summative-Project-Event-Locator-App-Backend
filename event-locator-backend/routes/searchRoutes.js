const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/searchController');
const { protect } = require('../middleware/authMiddleware');

// Use the class method properly
router.get('/', protect, (req, res, next) => {
  SearchController.search(req, res, next);
});

module.exports = router;