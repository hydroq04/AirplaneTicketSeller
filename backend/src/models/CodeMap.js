const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    trim: true
  },
  airportName: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
});

const CodeMap = mongoose.model('CodeMap', mapSchema);

module.exports = CodeMap;