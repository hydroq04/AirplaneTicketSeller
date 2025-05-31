# Airplane Ticket Seller Backend

Backend cho ứng dụng bán vé máy bay, xây dựng bằng **Node.js** với các API để quản lý vé, người dùng và đặt vé.

## Tính năng

- Đăng ký, đăng nhập người dùng
- Tìm kiếm và lọc chuyến bay
- Quản lý đặt vé
- API RESTful cho giao tiếp với frontend

## Công nghệ sử dụng

- **Node.js** & **Express.js**
- **MongoDB** (hoặc thay bằng database của bạn)
- **JWT** cho xác thực

## Yêu cầu

- **Node.js** (16.x trở lên)
- **npm**
- **MongoDB** (nếu sử dụng)

## Cài đặt

1. Clone repository:

   ```bash
   git clone https://github.com/hydroq04/AirplaneTicketSeller.git
   cd AirplaneTicketSeller/backend
   ```

2. Cài đặt dependencies:

   ```bash
   npm install -r requirements.txt
   ```

3. Tạo file `.env` với các biến:

   ```bash
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/airplane-ticket-seller
   JWT_SECRET=your_jwt_secret_key
   ```

## Chạy ứng dụng

1. Khởi động server:

   ```bash
   npm start
   ```

   Hoặc dùng `nodemon` cho dev:

   ```bash
   npm run dev
   ```

2. Server chạy tại `http://localhost:3000`.

## API chính

- `POST /api/auth/register`: Đăng ký người dùng
- `POST /api/auth/login`: Đăng nhập
- `GET /api/flights`: Lấy danh sách chuyến bay
- `POST /api/bookings`: Tạo đặt vé

## Cấu trúc dự án

```
backend/
├── src/              # Mã nguồn
│   ├── controllers/  # Xử lý yêu cầu API
│   ├── models/       # Mô hình database
│   ├── routes/       # Định nghĩa route
├── .env              # Biến môi trường
├── package.json      # Dependencies và scripts
└── README.md         # Tài liệu
```

## Đóng góp

1. Fork repo, tạo branch mới.
2. Commit thay đổi và đẩy lên.
3. Tạo Pull Request.

## Giấy phép

MIT License
