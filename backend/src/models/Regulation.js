const mongoose = require('mongoose');

const regulationSchema = new mongoose.Schema({
  soLuongSanBay: {
    type: Number,
    required: true,
    default: 20 // Giá trị mặc định
  },
  thoiGianBayToiThieu: {
    type: Number, // phút
    required: true,
    default: 30
  },
  soSanBayTrungGianToiDa: {
    type: Number,
    required: true,
    default: 2
  },
  thoiGianDungToiThieu: {
    type: Number, // phút
    required: true,
    default: 20
  },
  thoiGianDungToiDa: {
    type: Number, // phút
    required: true,
    default: 45
  },
  thoiGianDatVeChamNhat: {
    type: Number, // giờ trước khi khởi hành
    required: true,
    default: 12
  },
  thoiGianHuyVe: {
    type: Number, // ngày trước khi khởi hành
    required: true,
    default: 1
  }
}, { timestamps: true });

regulationSchema.statics.getRegulations = async function() {
  let regulations = await this.findOne();
  
  if (!regulations) {
    // Tạo mới với giá trị mặc định nếu chưa có
    regulations = await this.create({});
  }
  
  return regulations;
};

const Regulation = mongoose.model('Regulation', regulationSchema);

module.exports = Regulation;