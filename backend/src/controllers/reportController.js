const reportService = require('../services/reportService');

// Generate monthly report
exports.generateMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.body;
    
    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Month and year are required'
      });
    }
    
    const report = await reportService.generateMonthlyReport(month, year, req.user.id);
    
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Generate yearly report
exports.generateYearlyReport = async (req, res) => {
  try {
    const { year } = req.body;
    
    if (!year) {
      return res.status(400).json({
        success: false,
        message: 'Year is required'
      });
    }
    
    const report = await reportService.generateYearlyReport(year, req.user.id);
    
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get reports
exports.getReports = async (req, res) => {
  try {
    const reports = await reportService.getReports(req.query);
    
    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMonthlyRevenueReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    // Validate input
    if (!month || !year) {
      return res.status(400).json({ 
        success: false, 
        message: 'Month and year are required query parameters' 
      });
    }
    
    // Convert to integers
    const monthInt = parseInt(month, 10);
    const yearInt = parseInt(year, 10);
    
    // Validate values
    if (isNaN(monthInt) || isNaN(yearInt) || 
        monthInt < 1 || monthInt > 12 || 
        yearInt < 2000 || yearInt > 3000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid month or year values' 
      });
    }
    
    // Generate the BM5.1 report data
    const reportData = await reportService.generateMonthlyRevenueReport(monthInt, yearInt);
    
    res.status(200).json(reportData);
  } catch (error) {
    console.error('Error generating monthly revenue report:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating monthly revenue report', 
      error: error.message 
    });
  }
};