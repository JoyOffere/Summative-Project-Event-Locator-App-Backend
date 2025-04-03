const express = require('express');
const router = express.Router();

// Sample route for getting categories
router.get('/', (req, res) => {
  res.json({ message: 'List of categories' });
});

// Export the router
module.exports = router;
