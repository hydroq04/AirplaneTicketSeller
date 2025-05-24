const express = require('express');
const {
  getFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight,
  searchFlights
} = require('../features/flight/flightController');
const { protect, authorize } = require('../features/auth/authMiddleware');

const router = express.Router();

router.get('/search', searchFlights);
router.route('/')
  .get(getFlights)
  .post(protect, authorize('staff', 'admin'), createFlight);

router.route('/:id')
  .get(getFlight)
  .put(protect, authorize('staff', 'admin'), updateFlight)
  .delete(protect, authorize('staff', 'admin'), deleteFlight);

module.exports = router;
