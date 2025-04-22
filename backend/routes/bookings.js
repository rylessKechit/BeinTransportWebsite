const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  cancelBooking
} = require('../controllers/bookings');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .post(createBooking)
  .get(getBookings);

router.route('/:id')
  .get(getBooking)
  .put(updateBooking);

router.put('/:id/cancel', cancelBooking);

module.exports = router;
