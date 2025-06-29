const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Flight = require('./src/models/Flight');
const Booking = require('./src/models/Booking'); // Import mới
const Ticket = require('./src/models/Ticket'); // Import mới
const Payment = require('./src/models/Payment'); // Import mới
const Report = require('./src/models/Report'); // Import mới

dotenv.config({ path: path.join(__dirname, '.', '.env') });

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
      email: "duyphuc2425@gmail.com",
      password: "phuc1234",
      firstName: "Nguyễn Văn A",
      lastName: "",
      age: "223",
      dob: "2025-01-31",
      address: "Tây Ninh",
      bankInfo: "VCB-1231231231",
      role: "admin",
    },
    {
      email: "alice@example.com",
      password: "123456",
      firstName: "Alice",
      lastName: "",
      age: 25,
      dob: "2000-01-01",
      address: "Hà Nội",
      bankInfo: "VCB - 123456789",
      role: "user",
    },
    {
      email: "alex@alpha.com",
      password: "123456",
      firstName: "Alex",
      lastName: "",
      age: 26,
      dob: "1999-08-20",
      address: "Nam Định",
      bankInfo: "MB - 222333444",
      role: "user",
    },
    {
      email: "amanda@flower.com",
      password: "123456",
      firstName: "Amanda",
      lastName: "",
      age: 24,
      dob: "2001-02-14",
      address: "Quảng Nam",
      bankInfo: "ACB - 111222333",
      role: "user",
    },
    {
      email: "bob@example.com",
      password: "123456",
      firstName: "Bob",
      lastName: "",
      age: 30,
      dob: "1995-05-10",
      address: "TP.HCM",
      bankInfo: "TCB - 987654321",
      role: "user",
    },
    {
      email: "brian@beta.com",
      password: "123456",
      firstName: "Brian",
      lastName: "",
      age: 31,
      dob: "1994-04-22",
      address: "Long An",
      bankInfo: "VCB - 444555666",
      role: "user",
    },
    {
      email: "bella@beauty.vn",
      password: "123456",
      firstName: "Bella",
      lastName: "",
      age: 27,
      dob: "1997-07-07",
      address: "Vĩnh Long",
      bankInfo: "BIDV - 999888777",
      role: "user",
    },
    {
      email: "charlie@domain.com",
      password: "123456",
      firstName: "Charlie",
      lastName: "",
      age: 28,
      dob: "1997-03-15",
      address: "Đà Nẵng",
      bankInfo: "ACB - 654321987",
      role: "user",
    },
    {
      email: "chloe@cloud.com",
      password: "123456",
      firstName: "Chloe",
      lastName: "",
      age: 23,
      dob: "2002-12-01",
      address: "Đồng Nai",
      bankInfo: "Techcombank - 1122338899",
      role: "user",
    },
    {
      email: "catherine@cafe.vn",
      password: "123456",
      firstName: "Catherine",
      lastName: "",
      age: 29,
      dob: "1996-10-10",
      address: "Bình Định",
      bankInfo: "Sacombank - 5566778899",
      role: "user",
    },
    {
      email: "david@dev.com",
      password: "123456",
      firstName: "David",
      lastName: "",
      age: 33,
      dob: "1992-06-06",
      address: "Hà Nam",
      bankInfo: "Agribank - 1010101010",
      role: "admin",
    },
];

const flightsData = [
  // {
  //   flightNumber: 'VN123',
  //   airline: 'Vietnam Airlines',
  //   origin: 'HAN', // Hanoi
  //   destination: 'SGN', // Ho Chi Minh City
  //   departureTime: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 ngày tới
  //   arrivalTime: new Date(new Date().setDate(new Date().getDate() + 5) + 3 * 60 * 60 * 1000), // 3 giờ sau
  //   capacity: 150,
  //   availableSeats: 150, // Sẽ được cập nhật sau khi tạo vé
  //   price: 150.00
  // },
  // {
  //   flightNumber: 'VJ456',
  //   airline: 'Vietjet Air',
  //   origin: 'SGN', // Ho Chi Minh City
  //   destination: 'DAD', // Da Nang
  //   departureTime: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 ngày tới
  //   arrivalTime: new Date(new Date().setDate(new Date().getDate() + 7) + 1.5 * 60 * 60 * 1000), // 1.5 giờ sau
  //   capacity: 180,
  //   availableSeats: 180,
  //   price: 100.00
  // },
  // {
  //   flightNumber: 'BL789',
  //   airline: 'Bamboo Airways',
  //   origin: 'DAD', // Da Nang
  //   destination: 'HAN', // Hanoi
  //   departureTime: new Date(new Date().setDate(new Date().getDate() + 10)), // 10 ngày tới
  //   arrivalTime: new Date(new Date().setDate(new Date().getDate() + 10) + 1.8 * 60 * 60 * 1000), // 1.8 giờ sau
  //   capacity: 120,
  //   availableSeats: 120,
  //   price: 120.00
  // },
  {
    id: 1,
    airline: "Vietjet Air",
    timeFrom: new String (new Date(new Date(new Date().setDate(new Date().getDate() + 10)).setHours(21, 5)).toUTCString()),
    timeTo: new String (new Date(new Date(new Date().setDate(new Date().getDate() + 10)).setHours(22, 5)).toUTCString()),
    codeFrom: "SGN",
    codeTo: "CXR",
    duration: '',
    type: "Trực tiếp",
    price: 1570780,
    passengerCount: 42,
    capacity: 180,
  },
  {
    id: 2,
    airline: "Vietnam Airlines",
    timeFrom: new String (new Date(new Date(new Date().setDate(new Date().getDate() + 10)).setHours(18, 40)).toUTCString()),
    timeTo: new String (new Date(new Date(new Date().setDate(new Date().getDate() + 10)).setHours(19, 45)).toUTCString()),
    codeFrom: "SGN",
    codeTo: "CXR",
    duration: '',
    type: "Trực tiếp",
    price: 2551000,
    passengerCount: 65,
    capacity: 210,
  },
  { 
    id: 3, 
    airline: "Vietjet Air", 
    timeFrom: new String (new Date(new Date(new Date().setDate(new Date().getDate() + 11)).setHours(5, 30)).toUTCString()), 
    timeTo: new String (new Date(new Date(new Date().setDate(new Date().getDate() + 11)).setHours(6, 30)).toUTCString()), 
    codeFrom: "CXR", 
    codeTo: "SGN", 
    duration: '',
    type: "Trực tiếp", 
    price: 1570780, 
    passengerCount: 38,
    capacity: 180,
  },
  {
    id: 4,
    airline: "Vietnam Airlines",
    timeFrom: new String (new Date(new Date(new Date().setDate(new Date().getDate() + 11)).setHours(8, 55)).toUTCString()), 
    timeTo: new String (new Date(new Date(new Date().setDate(new Date().getDate() + 11)).setHours(10, 0)).toUTCString()), 
    codeFrom: "SGN",
    codeTo: "CXR",
    duration: '',
    type: "Trực tiếp",
    price: 3296000,
    passengerCount: 78,
    capacity: 210,
  },
  { 
    id: 5, 
    airline: "Vietjet Air", 
    timeFrom: new String (new Date(new Date(new Date().setDate(new Date().getDate() + 11)).setHours(12, 40)).toUTCString()), 
    timeTo: new String (new Date(new Date(new Date().setDate(new Date().getDate() + 11)).setHours(13, 40)).toUTCString()), 
    codeFrom: "SGN", 
    codeTo: "CXR", 
    duration: '',
    type: "Trực tiếp", 
    price: 2489539, 
    passengerCount: 50,
    capacity: 180,
  },
  { 
    id: 6, 
    airline: "Vietjet Air", 
    timeFrom: new String (new Date(new Date(new Date().setDate(new Date().getDate() + 11)).setHours(21, 5)).toUTCString()), 
    timeTo: new String (new Date(new Date(new Date().setDate(new Date().getDate() + 11)).setHours(22, 5)).toUTCString()), 
    codeFrom: "SGN", 
    codeTo: "CXR", 
    duration: '',
    type: "Trực tiếp", 
    price: 1570780, 
    passengerCount: 44,
    capacity: 180,
  },
  { 
    id: 7, 
    airline: "Vietnam Airlines", 
    timeFrom: new String (new Date(new Date(new Date().setDate(new Date().getDate() + 11)).setHours(18, 40)).toUTCString()), 
    timeTo: new String (new Date(new Date(new Date().setDate(new Date().getDate() + 11)).setHours(19, 45)).toUTCString()), 
    codeFrom: "CXR", 
    codeTo: "SGN", 
    duration: '',
    type: "Trực tiếp", 
    price: 2551000, 
    passengerCount: 61,
    capacity: 210,},
  { 
    id: 8,
    airline: "Vietnam Airlines",
    timeFrom: new String (new Date(new Date(new Date().setDate(new Date().getDate() + 11)).setHours(18, 40)).toUTCString()), 
    timeTo: new String (new Date(new Date(new Date().setDate(new Date().getDate() + 11)).setHours(19, 45)).toUTCString()), 
    codeFrom: "SGN",
    codeTo: "CXR",
    duration: '',
    type: "Trực tiếp",
    price: 3296000,
    passengerCount: 75,
    capacity: 210,
  },
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
    console.log('Users created.');

    for (const flight of flightsData) {
      const timeFrom = Date.parse(flight.timeFrom);
      const timeTo = Date.parse(flight.timeTo);
      // Tính toán duration nếu cần
      const durationInMs = timeTo - timeFrom;
      flight.duration = `${Math.floor(durationInMs / (1000 * 60 * 60))}h ${Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60))}m`;
    }

    const createdFlights = await Flight.create(flightsData);
    console.log('Flights created.');

    // Lưu trữ các đối tượng đã tạo để dễ dàng tham chiếu ID
    const customerUser = createdUsers.find(u => u.role === 'user');
    const staffUser = createdUsers.find(u => u.role === 'staff');
    const adminUser = createdUsers.find(u => u.role === 'admin');

    const flight1 = createdFlights.find(f => f.id === 1);
    const flight2 = createdFlights.find(f => f.id === 2);
    const flight3 = createdFlights.find(f => f.id === 3);

    // 3. Tạo Payments
    const payment1 = await Payment.create({
      amount: flight1.price * 2, // Giả định 2 vé cho booking đầu tiên
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
      flight: flight1._id,
      seatNumber: '12A',
      class: 'Phổ thông',
      passengerType: 'adults',
      price: flight1.price,
      status: 'confirmed'
    });
    const ticket2 = await Ticket.create({
      ticketNumber: 'TKT-VN123-002',
      customer: customerUser._id,
      flight: flight1._id,
      seatNumber: '12B',
      class: 'Phổ thông',
      passengerType: 'adults',
      price: flight1.price,
      status: 'confirmed'
    });
    const ticket3 = await Ticket.create({
      ticketNumber: 'TKT-VJ456-001',
      customer: customerUser._id,
      flight: flight2._id,
      seatNumber: '5C',
      class: 'Thương gia',
      passengerType: 'adults',
      price: flight2.price,
      status: 'reserved' // Vé đã đặt nhưng chưa xác nhận (chưa thanh toán)
    });
    console.log('Tickets created.');


    // 5. Tạo Bookings
    const booking1 = await Booking.create({
      bookingReference: 'BK-JOHN-001',
      customer: customerUser._id,
      tickets: [ticket1._id, ticket2._id],
      totalAmount: flight1.price * 2,
      payment: payment1._id, // Liên kết với payment đã tạo
      status: 'confirmed',
      contactInfo: { email: customerUser.email, phone: customerUser.phone },
      specialRequests: 'Vegetarian meal for 12A'
    });

    const booking2 = await Booking.create({
      bookingReference: 'BK-JOHN-002',
      customer: customerUser._id,
      tickets: [ticket3._id],
      totalAmount: flight2.price,
      status: 'pending', // Booking đang chờ thanh toán
      payment: null, // Chưa thanh toán
      contactInfo: { email: customerUser.email, phone: customerUser.phone },
      specialRequests: 'Window seat'
    });
    console.log('Bookings created.');

    // 6. Cập nhật availableSeats cho các chuyến bay sau khi đặt vé
    // Đây là bước quan trọng để giữ dữ liệu nhất quán với số vé đã tạo.
    // Trong môi trường thực tế, logic này nên được xử lý trong transaction khi tạo booking.
    flight1.passengerCount += 2; // Từ booking1
    await flight1.save();

    flight2.passengerCount += 1; // Từ booking2
    await flight2.save();
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