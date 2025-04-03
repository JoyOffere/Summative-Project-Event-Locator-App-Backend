const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  create,
  get,
  update,
  delete: deleteEvent
} = require('../controllers/eventController');

router.post('/', protect, create);
router.get('/:id', protect, get);
router.put('/:id', protect, update);
router.delete('/:id', protect, deleteEvent);

module.exports = router;