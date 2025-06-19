const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Các tùy chọn sau đã được loại bỏ trong Mongoose 6 trở lên
      // nếu bạn dùng Mongoose 5.x trở xuống thì nên bật chúng
      // useCreateIndex: true,
      // useFindAndModify: false
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;