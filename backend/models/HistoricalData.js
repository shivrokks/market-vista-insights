const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistoricalDataSchema = new Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  open: {
    type: Number,
    required: true
  },
  high: {
    type: Number,
    required: true
  },
  low: {
    type: Number,
    required: true
  },
  close: {
    type: Number,
    required: true
  },
  volume: {
    type: Number,
    required: true
  }
});

// Compound index for faster queries on symbol + date
HistoricalDataSchema.index({ symbol: 1, date: 1 }, { unique: true });

module.exports = HistoricalData = mongoose.model('historicalData', HistoricalDataSchema);