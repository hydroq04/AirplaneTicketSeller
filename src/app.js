const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// .env config
dotenv.config();

// Import models
const User = require('./models/User');
const Flight = require('./models/Flight');
const Booking = require('./models/Booking');
const Ticket = require('./models/Ticket');
const Payment = require('./models/Payment');
const Report = require('./models/Report');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
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
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
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
    
    let query = {};
    if (origin) query.origin = origin;
    if (destination) query.destination = destination;
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.departureTime = {
        $gte: searchDate,
        $lt: nextDay
      };
    }
    
    const flights = await Flight.find(query);
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
    
    // Create ticket
    const ticket = new Ticket({
      ticketNumber: 'TKT' + Math.floor(Math.random() * 1000000),
      customer: customerId,
      flight: flightId,
      seatNumber: 'A' + Math.floor(Math.random() * 30),
      class: seatClass || 'economy',
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
