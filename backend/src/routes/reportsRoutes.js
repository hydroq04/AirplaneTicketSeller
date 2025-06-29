const express = require('express');
const {
  generateMonthlyReport,
  generateYearlyReport,
  getReports,
  getMonthlyRevenueReport // Add this new controller
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Staff only routes
router.use(protect);
router.use(authorize('staff', 'admin'));

router.get('/', getReports);
router.post('/monthly', generateMonthlyReport);
router.post('/yearly', generateYearlyReport);
router.get('/monthly', getMonthlyRevenueReport); // Add this new GET endpoint

module.exports = router;
