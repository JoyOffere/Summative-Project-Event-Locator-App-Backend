const express = require('express');
const router = express.Router();

// Example routes
router.get('/', (req, res) => {
  res.json({ message: "Events endpoint working" });
});

module.exports = router;