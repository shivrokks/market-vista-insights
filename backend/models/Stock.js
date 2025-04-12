const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockSchema = new Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  change: {
    type: Number,
    required: true
  },
  changePercent: {
    type: Number,
    required: true
  },
  volume: {
    type: Number,
    required: true
  },
  marketCap: {
    type: Number,
    required: true
  },
  sector: {
    type: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = Stock = mongoose.model('stock', StockSchema);