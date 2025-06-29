const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true
  },
  seatNumber: {
    type: String,
    required: true,
    trim: true
  },
  class: {
    type: String,
    enum: ['Phổ thông', 'Thương gia', 'Hạng nhất'],
    default: 'Phổ thông'
  },
  passengerType: {
    type: String,
    enum: ['adults', 'children'],
    default: 'adults'
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['reserved', 'confirmed', 'cancelled'],
    default: 'reserved'
  }
}, {
  timestamps: true
});

// Method to calculate final price based on passenger type
ticketSchema.methods.getFinalPrice = function() {
  if (this.passengerType === 'child') {
    return this.price * 0.9; // 10% discount for children
  }
  return this.price;
};

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;