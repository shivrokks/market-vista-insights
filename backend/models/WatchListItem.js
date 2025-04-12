const mongoose = require("mongoose");

const WatchlistItemSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  stockSymbol: {
    type: String,
    required: true
  },
  stockData: {
    name: String,
    price: Number,
    change: Number,
    changePercent: Number
  }
}, { timestamps: true });

module.exports = mongoose.model("WatchlistItem", WatchlistItemSchema);