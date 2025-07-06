const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    trim: true
  },
  airline: {
    type: String,
    required: true,
    trim: true
  },
  timeFrom: {
    type: String,
    trim: true
  },
  timeTo: {
    type: String,
    trim: true
  },
  codeFrom: {
    type: String,
    trim: true
  },
  codeTo: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    default: 180
  },
  passengerCount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
}, {
  intermediateStops: [{
    airport: {
      type: String,
      required: true,
      trim: true
    },
    stopDuration: {
      type: Number, // Thời gian dừng tính bằng phút
      default: 30
    }
  }],
}, {
  timestamps: true
});


// Method to check if seats are available
flightSchema.methods.hasAvailableSeats = function(numSeats = 1) {
  return (this.capacity - this.passengerCount) >= numSeats;
};

// Method to book seats
flightSchema.methods.bookSeats = function(numSeats = 1) {
  if (!this.hasAvailableSeats(numSeats)) {
    throw new Error('Not enough seats available');
  }
  this.passengerCount += numSeats;
  return this.save();
};

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;