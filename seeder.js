const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Flight = require('./src/models/Flight');
const Booking = require('./src/models/Booking'); // Import mới
const Ticket = require('./src/models/Ticket'); // Import mới
const Payment = require('./src/models/Payment'); // Import mới
const Report = require('./src/models/Report'); // Import mới

dotenv.config({ path: './.env' });

const connectDB = async () => {
  try {
    console.log('Attempting to connect with MONGO_URI:', process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected for Seeder: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error connecting to DB for Seeder: ${err.message}`);
    process.exit(1);
  }
};

// Dữ liệu mẫu (sử dụng const để không bị ghi đè)
const usersData = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123', // Sẽ được hash bởi pre-save hook
    role: 'customer',
    phone: '123-456-7890'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    role: 'staff',
    phone: '098-765-4321'
  },
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'adminpassword',
    role: 'admin',
    phone: '111-222-3333'
  }
];

const flightsData = [
  {
    flightNumber: 'VN123',
    airline: 'Vietnam Airlines',
    origin: 'HAN', // Hanoi
    destination: 'SGN', // Ho Chi Minh City
    departureTime: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 ngày tới
    arrivalTime: new Date(new Date().setDate(new Date().getDate() + 5) + 3 * 60 * 60 * 1000), // 3 giờ sau
    capacity: 150,
    availableSeats: 150, // Sẽ được cập nhật sau khi tạo vé
    price: 150.00
  },
  {
    flightNumber: 'VJ456',
    airline: 'Vietjet Air',
    origin: 'SGN', // Ho Chi Minh City
    destination: 'DAD', // Da Nang
    departureTime: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 ngày tới
    arrivalTime: new Date(new Date().setDate(new Date().getDate() + 7) + 1.5 * 60 * 60 * 1000), // 1.5 giờ sau
    capacity: 180,
    availableSeats: 180,
    price: 100.00
  },
  {
    flightNumber: 'BL789',
    airline: 'Bamboo Airways',
    origin: 'DAD', // Da Nang
    destination: 'HAN', // Hanoi
    departureTime: new Date(new Date().setDate(new Date().getDate() + 10)), // 10 ngày tới
    arrivalTime: new Date(new Date().setDate(new Date().getDate() + 10) + 1.8 * 60 * 60 * 1000), // 1.8 giờ sau
    capacity: 120,
    availableSeats: 120,
    price: 120.00
  }
];

const importData = async () => {
  try {
    await connectDB(); // Kết nối DB

    // 1. Xóa tất cả dữ liệu cũ (để tránh trùng lặp và làm sạch)
    await User.deleteMany();
    await Flight.deleteMany();
    await Booking.deleteMany();
    await Ticket.deleteMany();
    await Payment.deleteMany();
    await Report.deleteMany();
    console.log('Old data destroyed!');

    // 2. Tạo Users và Flights trước
    const createdUsers = await User.create(usersData);
    const createdFlights = await Flight.create(flightsData);
    console.log('Users and Flights created.');

    // Lưu trữ các đối tượng đã tạo để dễ dàng tham chiếu ID
    const customerUser = createdUsers.find(u => u.email === 'john.doe@example.com');
    const staffUser = createdUsers.find(u => u.email === 'jane.smith@example.com');
    const adminUser = createdUsers.find(u => u.email === 'admin@example.com');

    const flightVN123 = createdFlights.find(f => f.flightNumber === 'VN123');
    const flightVJ456 = createdFlights.find(f => f.flightNumber === 'VJ456');
    const flightBL789 = createdFlights.find(f => f.flightNumber === 'BL789');


    // 3. Tạo Payments
    const payment1 = await Payment.create({
      amount: flightVN123.price * 2, // Giả định 2 vé cho booking đầu tiên
      currency: 'USD',
      paymentMethod: 'credit_card',
      status: 'completed',
      customer: customerUser._id
    });
    console.log('Payment 1 created.');

    // 4. Tạo Tickets
    const ticket1 = await Ticket.create({
      ticketNumber: 'TKT-VN123-001',
      customer: customerUser._id,
      flight: flightVN123._id,
      seatNumber: '12A',
      class: 'economy',
      status: 'confirmed'
    });
    const ticket2 = await Ticket.create({
      ticketNumber: 'TKT-VN123-002',
      customer: customerUser._id,
      flight: flightVN123._id,
      seatNumber: '12B',
      class: 'economy',
      status: 'confirmed'
    });
    const ticket3 = await Ticket.create({
      ticketNumber: 'TKT-VJ456-001',
      customer: customerUser._id,
      flight: flightVJ456._id,
      seatNumber: '5C',
      class: 'business',
      status: 'reserved' // Vé đã đặt nhưng chưa xác nhận (chưa thanh toán)
    });
    console.log('Tickets created.');


    // 5. Tạo Bookings
    const booking1 = await Booking.create({
      bookingReference: 'BK-JOHN-001',
      customer: customerUser._id,
      tickets: [ticket1._id, ticket2._id],
      totalAmount: flightVN123.price * 2,
      payment: payment1._id, // Liên kết với payment đã tạo
      status: 'confirmed',
      contactInfo: { email: customerUser.email, phone: customerUser.phone },
      specialRequests: 'Vegetarian meal for 12A'
    });

    const booking2 = await Booking.create({
      bookingReference: 'BK-JOHN-002',
      customer: customerUser._id,
      tickets: [ticket3._id],
      totalAmount: flightVJ456.price,
      status: 'pending', // Booking đang chờ thanh toán
      contactInfo: { email: customerUser.email, phone: customerUser.phone },
      specialRequests: 'Window seat'
    });
    console.log('Bookings created.');

    // 6. Cập nhật availableSeats cho các chuyến bay sau khi đặt vé
    // Đây là bước quan trọng để giữ dữ liệu nhất quán với số vé đã tạo.
    // Trong môi trường thực tế, logic này nên được xử lý trong transaction khi tạo booking.
    flightVN123.availableSeats -= 2; // Từ booking1
    await flightVN123.save();

    flightVJ456.availableSeats -= 1; // Từ booking2
    await flightVJ456.save();
    console.log('Flight available seats updated.');


    // 7. Tạo Reports (lấy dữ liệu mẫu đơn giản, có thể phức tạp hơn nếu cần)
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const thisYearStart = new Date(today.getFullYear(), 0, 1);
    const thisYearEnd = new Date(today.getFullYear(), 11, 31, 23, 59, 59);

    await Report.create({
      name: `Monthly Revenue - ${lastMonth.toLocaleString('default', { month: 'long' })} ${lastMonth.getFullYear()}`,
      type: 'monthly',
      period: { startDate: lastMonth, endDate: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0, 23, 59, 59) },
      data: {
        totalRevenue: 50000,
        totalBookings: 300,
        popularRoutes: [
          { origin: 'HAN', destination: 'SGN', count: 100 },
          { origin: 'SGN', destination: 'DAD', count: 70 }
        ],
        additionalMetrics: {
          averageBookingValue: 166.67
        }
      },
      createdBy: adminUser._id
    });

    await Report.create({
      name: `Annual Summary - ${today.getFullYear()}`,
      type: 'yearly',
      period: { startDate: thisYearStart, endDate: thisYearEnd },
      data: {
        totalRevenue: 600000,
        totalBookings: 3500,
        popularRoutes: [
          { origin: 'HAN', destination: 'SGN', count: 1200 },
          { origin: 'SGN', destination: 'DAD', count: 800 },
          { origin: 'DAD', destination: 'HAN', count: 500 }
        ],
        additionalMetrics: {
          averageBookingValue: 171.43,
          monthlyAverageBookings: 291.67,
          monthlyAverageRevenue: 50000
        }
      },
      createdBy: adminUser._id
    });
    console.log('Reports created.');

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB(); // Kết nối DB
    await User.deleteMany();
    await Flight.deleteMany();
    await Booking.deleteMany();
    await Ticket.deleteMany();
    await Payment.deleteMany();
    await Report.deleteMany();

    console.log('All Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-import') {
  importData();
} else if (process.argv[2] === '-destroy') {
  destroyData();
} else {
  console.log('Usage: node seeder.js -import OR node seeder.js -destroy');
  process.exit(1);
}