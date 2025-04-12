const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WatchlistItemSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  stockSymbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can't add the same stock twice
WatchlistItemSchema.index({ userId: 1, stockSymbol: 1 }, { unique: true });

module.exports = WatchlistItem = mongoose.model('watchlistItem', WatchlistItemSchema);