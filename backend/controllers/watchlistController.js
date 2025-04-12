const WatchlistItem = require("../models/WatchListItem");

// Add to watchlist
const addToWatchlist = async (req, res) => {
  const { userId, stockSymbol, name, price, change, changePercent } = req.body;

  if (!userId || !stockSymbol || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existing = await WatchlistItem.findOne({ userId, stockSymbol });
    if (existing) {
      return res.status(400).json({ message: "Stock already in watchlist" });
    }

    const newWatchlistItem = new WatchlistItem({
      userId,
      stockSymbol,
      stockData: {
        name,
        price,
        change,
        changePercent
      }
    });

    await newWatchlistItem.save();

    return res.status(201).json({
      message: "Stock added to watchlist",
      item: newWatchlistItem
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all watchlist items for a user
const getWatchlistItems = async (req, res) => {
  const { userId } = req.params;  // This assumes you're using a URL parameter

  try {
    const watchlistItems = await WatchlistItem.find({ userId });

    console.log("Watchlist items for userId:", userId, watchlistItems); // <-- Log to see what's retrieved
    return res.status(200).json(watchlistItems);
  } catch (error) {
    console.error("Error fetching watchlist items:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  addToWatchlist,
  getWatchlistItems
};