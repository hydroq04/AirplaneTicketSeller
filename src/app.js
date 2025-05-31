const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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
mongoose.connect('mongodb+srv://quanhoconline0112:brqr6zUuPdIWNRLm@cluster0.qn1wksd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Sample route to test if server is working
app.get('/', (req, res) => {
  res.send('Welcome to Airplane Ticket Seller API');
});

// Test routes for User model
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Test routes for Flight model
app.get('/api/flights', async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/flights', async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json(flight);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Test routes for Booking model
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('customer').populate('tickets');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Test routes for Ticket model
app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('customer').populate('flight');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/tickets', async (req, res) => {
  try {
    const ticket = new Ticket(req.body);
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Test routes for Payment model
app.get('/api/payments', async (req, res) => {
  try {
    const payments = await Payment.find().populate('customer');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/payments', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Test routes for Report model
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find().populate('createdBy');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // For testing purposes
