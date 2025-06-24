const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import models
const User = require('./models/User');
const Flight = require('./models/Flight');
const Booking = require('./models/Booking');
const Ticket = require('./models/Ticket');
const Payment = require('./models/Payment');
const Report = require('./models/Report');

// Initialize Express app
const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',  // đúng port frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

const PORT = process.env.PORT || 3000;

// Use config from .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const uri = process.env.MONGO_URI;
// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the frontend directory (outside src)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// User registration
app.post('/api/users/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ success: true, userId: user._id });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// User login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    res.json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.firstName,
        lastName: user.lastName,
        address: user.address,
        email: user.email,
        role: user.role,
        bankInfo: user.bankInfo,
        dob: user.dob
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all flights
app.get('/api/flights', async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search flights
app.get('/api/flights/search', async (req, res) => {
  try {
    const { origin, destination, date } = req.query;

    // Location mapping (full names to airport codes)
    const locationMap = {
      'hồ chí minh': 'SGN',
      'tp.hcm': 'SGN',
      'sài gòn': 'SGN',
      'hà nội': 'HAN',
      'hanoi': 'HAN',
      'đà nẵng': 'DAD',
      'danang': 'DAD',
      'nha trang': 'CXR',
      'cam ranh': 'CXR',
      'phú quốc': 'PQC',
      'phu quoc': 'PQC',
      'đà lạt': 'DLI',
      'dalat': 'DLI'
    };

    let query = {};
    
    // Process origin parameter
    if (origin) {
      // Check if it's a full location name (case insensitive)
      const normalizedOrigin = origin.toLowerCase().trim();
      if (locationMap[normalizedOrigin]) {
        // Use the airport code from our mapping
        query.codeFrom = locationMap[normalizedOrigin];
      } else {
        // If not found in mapping, use as-is (might be a direct airport code)
        query.codeFrom = origin;
      }
    }
    
    // Process destination parameter
    if (destination) {
      // Check if it's a full location name (case insensitive)
      const normalizedDest = destination.toLowerCase().trim();
      if (locationMap[normalizedDest]) {
        // Use the airport code from our mapping
        query.codeTo = locationMap[normalizedDest];
      } else {
        // If not found in mapping, use as-is (might be a direct airport code)
        query.codeTo = destination;
      }
    }

    if (date) {
      const [day, month, year] = date.split('/');
      if (!day || !month || !year) {
        return res.status(400).json({ message: 'Sai định dạng ngày. Đúng: dd/MM/yyyy' });
      }

      const keyword = `${day} ${getMonthName(month)} ${year}`; // "30 Jun 2025"
      query.timeFrom = { $regex: new RegExp(keyword) };
    }

    const flights = await Flight.find(query);
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Hàm hỗ trợ đổi "06" → "Jun"
function getMonthName(mm) {
  return [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ][parseInt(mm, 10) - 1];
}

// Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { customerId, flightId, passengerDetails, seatClass } = req.body;
    
    // Get the flight
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }
    
    // Check seat availability
    if (!flight.hasAvailableSeats()) {
      return res.status(400).json({ success: false, message: 'No seats available' });
    }
    
    // Generate booking reference
    const bookingReference = Math.random().toString(36).substring(2, 10).toUpperCase();
    console.log(customerId)
    // Create ticket
    const ticket = new Ticket({
      ticketNumber: 'TKT' + Math.floor(Math.random() * 1000000),
      customer: customerId,
      flight: flightId,
      seatNumber: 'A' + Math.floor(Math.random() * 30),
      class: seatClass || 'Phổ thông',
      status: 'reserved'
    });
    await ticket.save();
    
    // Create booking
    const booking = new Booking({
      bookingReference,
      customer: customerId,
      tickets: [ticket._id],
      totalAmount: flight.price,
      status: 'pending',
      contactInfo: {
        email: passengerDetails.email,
        phone: passengerDetails.phone
      }
    });
    await booking.save();

    // Update flight available seats
    await flight.bookSeats(1);
    
    res.status(201).json({ 
      success: true, 
      booking: {
        id: booking._id,
        bookingReference: booking.bookingReference,
        totalAmount: booking.totalAmount
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get user bookings
app.get('/api/bookings/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.params.userId })
      .populate({
        path: 'tickets',
        populate: { path: 'flight' }
      });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
