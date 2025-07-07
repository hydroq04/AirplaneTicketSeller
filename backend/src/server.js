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
const Regulation = require('./models/Regulation');
const CodeMap = require('./models/CodeMap');

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

// Serve static files from the client directory (outside src)
app.use(express.static(path.join(__dirname, '..', 'client')));

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
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
        dob: user.dob,
        cccd: user.cccd,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// Get user list
app.get('/api/users', async (req, res) => {
  try {
    // Lấy danh sách người dùng có role="user"
    const users = await User.find({ role: 'user' }).select('-password');
    
    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách users:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all airport code mappings
app.get('/api/codemaps', async (req, res) => {
  try {
    const codeMaps = await CodeMap.find();
    res.json(codeMaps);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching airport code mappings', 
      error: error.message 
    });
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

    // Fetch all code mappings from database
    const codeMappings = await CodeMap.find();
    // console.log('Code mappings found:', codeMappings);
 
    let query = {};
    
    // Process origin parameter
    if (origin) {
      for (const mapping of codeMappings) {
        if (mapping.city == origin) {
          query.codeFrom = mapping.code;
          break;
        }
      }
    }
    
    // Process destination parameter
    if (destination) {
      for (const mapping of codeMappings) {
        if (mapping.city == destination) {
          query.codeTo = mapping.code;
          break;
        }
      }
    }

    if (date) {
      // date dạng dd/MM/yyyy
      const [day, month, year] = date.split('/');
      if (!day || !month || !year) {
        return res.status(400).json({ message: 'Sai định dạng ngày. Đúng: dd/MM/yyyy' });
      }
      // Tạo khoảng thời gian từ 00:00 đến 23:59 ngày đó
      const start = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
      const end = new Date(`${year}-${month}-${day}T23:59:59.999Z`);

      // Tìm tất cả chuyến bay có timeFrom nằm trong khoảng này
      query.$expr = {
        $and: [
          { $gte: [{ $toDate: "$timeFrom" }, start] },
          { $lte: [{ $toDate: "$timeFrom" }, end] }
        ]
      };
    }
    const flights = await Flight.find(query);
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/flights', async (req, res) => {
  try {
    const flight = new Flight(req.body);
    console.log('Creating flight:', req.body);
    await flight.save();
    res.status(201).json(flight);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/flights/:id', async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!flight) {
      return res.status(404).json({ message: 'Chuyến bay không tìm thấy' });
    }
    res.json(flight);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/flights/:id', async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Chuyến bay không tìm thấy' });
    }
    res.json({ message: 'Chuyến bay đã được xóa' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tickets count by class for a specific flight
app.get('/api/flights/:flightId/tickets-by-class', async (req, res) => {
  try {
    const { flightId } = req.params;
    
    // Tìm flight theo id
    const flight = await Flight.findOne({ id: parseInt(flightId) });
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }
    
    // Sử dụng id của flight để tìm vé
    const ticketsByClass = await Ticket.aggregate([
      // Lọc vé của chuyến bay này và không bị hủy
      { $match: { flight: new mongoose.Types.ObjectId(flight._id), status: { $ne: 'canceled' } } },
      // Nhóm theo hạng ghế và đếm
      { $group: { 
        _id: "$class", 
        count: { $sum: 1 } 
      }},
      // Định dạng kết quả
      { $project: {
        _id: 0,
        class: "$_id",
        count: 1
      }}
    ]);
    
    // Phần còn lại giữ nguyên
    const allClasses = ['Phổ thông', 'Thương gia', 'Hạng nhất'];
    const result = allClasses.map(className => {
      const found = ticketsByClass.find(item => item.class === className);
      return {
        class: className,
        count: found ? found.count : 0
      };
    });
    
    res.json({
      success: true,
      flightId: flight.id,
      flightCode: `${flight.airline} (${flight.codeFrom}-${flight.codeTo})`,
      ticketsByClass: result,
      totalTickets: result.reduce((sum, item) => sum + item.count, 0)
    });
  } catch (error) {
    console.error('Error getting tickets by class:', error);
    res.status(500).json({ success: false, message: error.message });
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
    
    // Lấy quy định hiện tại
    const regulations = await Regulation.getRegulations();
    
    // Lấy thông tin chuyến bay
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy chuyến bay' });
    }
    
    // Kiểm tra thời gian đặt vé so với quy định
    const now = new Date();
    const departureTime = new Date(flight.timeFrom);
    const hoursUntilDeparture = (departureTime - now) / (1000 * 60 * 60);
    
    if (hoursUntilDeparture < regulations.thoiGianDatVeChamNhat) {
      return res.status(400).json({
        success: false,
        message: `Vé phải được đặt ít nhất ${regulations.thoiGianDatVeChamNhat} giờ trước khi khởi hành`
      });
    }
    
    // Tiếp tục với logic đặt vé hiện tại
    // Get the flight
    if (!flight.hasAvailableSeats()) {
      return res.status(400).json({ success: false, message: 'No seats available' });
    }
    
    // Create tickets for each passenger type
    const tickets = [];
    
    // Create adult tickets
    for (let i = 0; i < passengerDetails.adults; i++) {
      const ticket = new Ticket({
        ticketNumber: 'TKT' + Math.floor(Math.random() * 1000000),
        customer: customerId,
        flight: flightId,
        seatNumber: 'A' + Math.floor(Math.random() * 30),
        class: seatClass || 'Phổ thông',
        passengerType: 'adults',
        price: flight.price,
        status: 'confirmed'
      });
      await ticket.save();
      tickets.push(ticket._id);
    }
    
    // Create child tickets
    for (let i = 0; i < passengerDetails.children; i++) {
      const ticket = new Ticket({
        ticketNumber: 'TKT' + Math.floor(Math.random() * 1000000),
        customer: customerId,
        flight: flightId,
        seatNumber: 'C' + Math.floor(Math.random() * 30),
        class: seatClass || 'Phổ thông',
        passengerType: 'children',
        price: flight.price * 0.9, // 10% discount applied
        status: 'confirmed'
      });
      await ticket.save();
      tickets.push(ticket._id);
    }
    
    // Calculate total amount
    const totalAmount = (passengerDetails.adults * flight.price) + 
                      (passengerDetails.children * flight.price * 0.9);
    
    // Create booking with all tickets
    const booking = new Booking({
      bookingReference: Math.random().toString(36).substring(2, 10).toUpperCase(),
      customer: customerId,
      tickets: tickets,
      totalAmount: totalAmount,
      status: 'confirmed',
      contactInfo: {
        email: passengerDetails.email,
        phone: passengerDetails.phone
      }
    });
    await booking.save();

    // Update flight available seats
    await flight.bookSeats(passengerDetails.adults + passengerDetails.children);
    
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

// Cancel ticket
app.put('/api/tickets/:ticketId/cancel', async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    // Tìm vé
    const ticket = await Ticket.findById(ticketId).populate('flight');
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy vé' });
    }
    
    // Lấy quy định hiện tại
    const regulations = await Regulation.getRegulations();
    
    // Kiểm tra thời gian hủy vé so với quy định
    const now = new Date();
    const departureTime = new Date(ticket.flight.timeFrom);
    const daysUntilDeparture = (departureTime - now) / (1000 * 60 * 60 * 24);
    
    if (daysUntilDeparture < regulations.thoiGianHuyVe) {
      return res.status(400).json({
        success: false,
        message: `Vé chỉ có thể được hủy ít nhất ${regulations.thoiGianHuyVe} ngày trước khi khởi hành`
      });
    }
    
    // Chỉ hủy nếu chưa được hủy
    if (ticket.status === 'canceled') {
      return res.status(400).json({ success: false, message: 'Vé đã được hủy' });
    }
    
    // Lưu trạng thái trước đó để tham khảo
    const previousStatus = ticket.status;
    
    // Cập nhật trạng thái vé
    ticket.status = 'canceled';
    await ticket.save();
    
    // Nếu vé đã được xác nhận, cần cập nhật số ghế của chuyến bay
    if (previousStatus === 'confirmed') {
      const flight = await Flight.findById(ticket.flight);
      if (flight) {
        // Giảm số lượng hành khách để giải phóng ghế
        flight.passengerCount = Math.max(0, flight.passengerCount - 1);
        await flight.save();
      }
    }
    
    // Cập nhật trạng thái đặt vé nếu tất cả vé đều bị hủy
    const booking = await Booking.findOne({ tickets: ticketId });
    if (booking) {
      const allTickets = await Ticket.find({ _id: { $in: booking.tickets } });
      const allCanceled = allTickets.every(t => t.status === 'canceled');
      
      if (allCanceled) {
        booking.status = 'canceled';
        await booking.save();
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Vé đã được hủy thành công',
      ticket: ticket
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete ticket
app.delete('/api/tickets/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    // Find the ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    // If the ticket was confirmed, update the flight's available seats
    if (ticket.status === 'confirmed') {
      const flight = await Flight.findById(ticket.flight);
      if (flight) {
        // Reduce passenger count to free up the seat
        flight.passengerCount = Math.max(0, flight.passengerCount - 1);
        await flight.save();
      }
    }
    
    // Remove ticket from any booking
    await Booking.updateMany(
      { tickets: ticketId },
      { $pull: { tickets: ticketId } }
    );
    
    // Delete the ticket
    await Ticket.findByIdAndDelete(ticketId);
    
    // Update any empty bookings (no tickets left)
    const emptyBookings = await Booking.find({ tickets: { $size: 0 } });
    for (const booking of emptyBookings) {
      // Option 1: Delete empty bookings
      await Booking.findByIdAndDelete(booking._id);
      
      // Option 2: Or mark them as canceled
      // booking.status = 'canceled';
      // await booking.save();
    }
    
    res.json({ 
      success: true, 
      message: 'Ticket has been deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update ticket
app.put('/api/tickets/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { seatNumber, seatClass, status } = req.body;
    
    // Find the ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    // Update ticket properties
    if (seatNumber) ticket.seatNumber = seatNumber;
    if (seatClass) ticket.class = seatClass;
    
    // Special handling for status changes
    if (status && status !== ticket.status) {
      const previousStatus = ticket.status;
      ticket.status = status;
      
      // If status changed to or from 'confirmed', update flight seats
      if (status === 'confirmed' || previousStatus === 'confirmed') {
        const flight = await Flight.findById(ticket.flight);
        if (flight) {
          if (status === 'confirmed' && previousStatus !== 'confirmed') {
            // Increase passenger count if newly confirmed
            flight.passengerCount += 1;
          } else if (status !== 'confirmed' && previousStatus === 'confirmed') {
            // Decrease passenger count if no longer confirmed
            flight.passengerCount = Math.max(0, flight.passengerCount - 1);
          }
          await flight.save();
        }
      }
      
      // If status changed to 'confirmed', update the booking status if needed
      if (status === 'confirmed') {
        const booking = await Booking.findOne({ tickets: ticketId });
        if (booking && booking.status === 'pending') {
          booking.status = 'confirmed';
          await booking.save();
        }
      }
    }
    
    await ticket.save();
    
    // If part of a booking, update the booking
    const booking = await Booking.findOne({ tickets: ticketId });
    if (booking) {
      // If status changed to 'confirmed', might need to update booking status
      if (status === 'confirmed' && booking.status === 'pending') {
        booking.status = 'confirmed';
        await booking.save();
      }
      
      // Check if all tickets are canceled
      if (status === 'canceled') {
        const allTickets = await Ticket.find({ _id: { $in: booking.tickets } });
        const allCanceled = allTickets.every(t => t.status === 'canceled');
        
        if (allCanceled) {
          booking.status = 'canceled';
          await booking.save();
        }
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Ticket updated successfully',
      ticket: ticket
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Confirm booking payment
app.post('/api/bookings/:bookingId/quick-payment', async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    // Tìm booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Nếu đã thanh toán rồi thì trả về thành công luôn
    if (booking.status === 'confirmed') {
      return res.json({
        success: true,
        message: 'Booking already paid',
        booking: {
          id: booking._id,
          status: booking.status,
          totalAmount: booking.totalAmount
        }
      });
    }
    
    // Chỉ xử lý booking đang pending
    if (booking.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot process payment for booking with status: ${booking.status}` 
      });
    }
    
    // Tạo thanh toán và đặt mặc định là đã hoàn tất
    const payment = new Payment({
      amount: booking.totalAmount,
      currency: 'VND',
      paymentMethod: 'credit_card', // Mặc định
      status: 'completed',
      customer: booking.customer
    });
    
    await payment.save();
    
    // Cập nhật booking
    booking.status = 'confirmed';
    booking.payment = payment._id;
    await booking.save();
    
    // Cập nhật tất cả vé thành confirmed
    await Ticket.updateMany(
      { _id: { $in: booking.tickets } },
      { status: 'confirmed' }
    );
    
    res.json({
      success: true,
      message: 'Payment successful',
      booking: {
        id: booking._id,
        status: booking.status,
        totalAmount: booking.totalAmount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Monthly Revenue Report (BM5.1)
app.get('/api/reports/monthly', async (req, res) => {
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
    
    // Create date range for the requested month
    const startDate = new Date(yearInt, monthInt - 1, 1);
    const endDate = new Date(yearInt, monthInt, 0, 23, 59, 59);
    
    // Step 1: Find all flights with departure date in the specified month
    const monthName = getMonthName(monthInt.toString().padStart(2, '0'));
    const flightPattern = new RegExp(`\\d{2} ${monthName} ${yearInt}`);
    
    const flights = await Flight.find({
      timeFrom: { $regex: flightPattern }
    });
    
    if (flights.length === 0) {
      return res.json([]);
    }
    
    // Step 2: Process each flight to get ticket sales and revenue
    let totalMonthlyRevenue = 0;
    const flightReports = [];
    
    for (const flight of flights) {
      // Find all confirmed tickets for this flight
      const tickets = await Ticket.find({
        flight: flight._id,
        status: 'confirmed'
      });
      
      // Calculate revenue for this flight (sum of all ticket prices)
      const flightRevenue = tickets.reduce((sum, ticket) => sum + ticket.price, 0);
      
      // Add to total monthly revenue
      totalMonthlyRevenue += flightRevenue;
      
      flightReports.push({
        flightId: flight.id,
        airline: flight.airline,
        route: `${flight.codeFrom} → ${flight.codeTo}`,
        departureDate: flight.timeFrom,
        ticketCount: tickets.length,
        revenue: flightRevenue
      });
    }
    
    // Step 4: Calculate percentage for each flight
    const reportData = flightReports.map(flight => ({
      flightId: flight.flightId,
      airline: flight.airline,
      route: flight.route,
      departureDate: flight.departureDate,
      ticketCount: flight.ticketCount,
      revenue: flight.revenue,
      percentage: totalMonthlyRevenue > 0 
        ? `${((flight.revenue / totalMonthlyRevenue) * 100).toFixed(2)}%`
        : '0.00%'
    }));
    
    // Optional: Save this report to the database
    const report = new Report({
      name: `Monthly Revenue Report - ${monthInt}/${yearInt}`,
      type: 'monthly',
      period: {
        startDate,
        endDate
      },
      data: {
        totalRevenue: totalMonthlyRevenue,
        totalBookings: reportData.reduce((sum, flight) => sum + flight.ticketCount, 0),
        popularRoutes: reportData.map(flight => ({
          origin: flight.route.split(' → ')[0],
          destination: flight.route.split(' → ')[1],
          count: flight.ticketCount
        }))
      },
      createdBy: req.user ? req.user._id : null // You may need to adjust this based on your auth system
    });
    
    await report.save();
    
    res.json({
      month: monthInt,
      year: yearInt,
      totalRevenue: totalMonthlyRevenue,
      flights: reportData
    });
    
  } catch (error) {
    console.error('Error generating monthly revenue report:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating monthly revenue report', 
      error: error.message 
    });
  }
});

// Lấy quy định hiện tại
app.get('/api/regulations', async (req, res) => {
  try {
    const regulations = await Regulation.getRegulations();
    res.json(regulations);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi khi lấy quy định', 
      error: error.message 
    });
  }
});

// Cập nhật quy định
app.put('/api/regulations', async (req, res) => {
  try {
    // Có thể thêm kiểm tra quyền admin ở đây nếu cần
    
    let regulations = await Regulation.findOne();
    if (!regulations) {
      regulations = new Regulation();
    }
    
    // Cập nhật các trường từ request body
    const updateFields = [
      'soLuongSanBay',
      'thoiGianBayToiThieu',
      'soSanBayTrungGianToiDa',
      'thoiGianDungToiThieu',
      'thoiGianDungToiDa',
      'thoiGianDatVeChamNhat',
      'thoiGianHuyVe'
    ];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        // Kiểm tra giá trị số phải dương
        if (typeof req.body[field] === 'number' && req.body[field] >= 0) {
          regulations[field] = req.body[field];
        } else if (req.body[field] !== undefined) {
          throw new Error(`Trường ${field} phải là số dương`);
        }
      }
    });
    
    await regulations.save();
    
    res.json({
      success: true,
      message: 'Quy định đã được cập nhật thành công',
      regulations
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Lỗi khi cập nhật quy định', 
      error: error.message 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
