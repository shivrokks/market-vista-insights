const WatchlistItem = require('../models/Watchlist');
const Stock = require('../models/Stock');
const axios = require('axios');
const config = require('../config/default');

// Function to fetch latest stock quote from Finnhub
async function refreshStockData(symbol) {
  try {
    // Fetch quote
    const quoteResponse = await axios.get(`https://finnhub.io/api/v1/quote`, {
      params: {
        symbol,
        token: config.finnhubApiKey
      }
    });
    
    // Fetch profile
    const profileResponse = await axios.get(`https://finnhub.io/api/v1/stock/profile2`, {
      params: {
        symbol,
        token: config.finnhubApiKey
      }
    });
    
    const quote = quoteResponse.data;
    const profile = profileResponse.data;
    
    // Transform to our stock model
    const stockData = {
      symbol,
      name: profile.name || symbol,
      price: quote.c,
      change: quote.d,
      changePercent: quote.dp,
      volume: quote.v,
      marketCap: profile.marketCapitalization ? profile.marketCapitalization * 1000000 : 0,
      sector: profile.finnhubIndustry || "",
      lastUpdated: new Date()
    };
    
    // Update in database
    return await Stock.findOneAndUpdate(
      { symbol },
      stockData,
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error(`Error refreshing stock data for ${symbol}:`, err.message);
    // Return existing data or null
    return await Stock.findOne({ symbol });
  }
}

// Get user's watchlist
exports.getWatchlist = async (req, res) => {
  try {
    // Get all watchlist items for the current user
    const watchlistItems = await WatchlistItem.find({ userId: req.user.id });
    
    // Get stock symbols from watchlist items
    const symbols = watchlistItems.map(item => item.stockSymbol);
    
    // Refresh stock data for all symbols in watchlist (in parallel)
    const refreshPromises = symbols.map(symbol => refreshStockData(symbol));
    await Promise.all(refreshPromises);
    
    // Get updated stock data
    const stocks = await Stock.find({ symbol: { $in: symbols } });
    
    // Return both the watchlist items and corresponding stock data
    res.json({
      items: watchlistItems,
      stocks: stocks
    });
  } catch (err) {
    console.error('Get watchlist error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add stock to watchlist
exports.addToWatchlist = async (req, res) => {
  try {
    const { symbol } = req.body;
    
    if (!symbol) {
      return res.status(400).json({ message: 'Stock symbol is required' });
    }
    
    const uppercaseSymbol = symbol.toUpperCase();
    
    // Verify symbol exists by fetching its data
    try {
      await refreshStockData(uppercaseSymbol);
    } catch (err) {
      return res.status(404).json({ message: 'Stock symbol not found' });
    }
    
    // Check if stock is already in watchlist
    const existingItem = await WatchlistItem.findOne({
      userId: req.user.id,
      stockSymbol: uppercaseSymbol
    });
    
    if (existingItem) {
      return res.status(409).json({ message: 'Stock already in watchlist' });
    }
    
    // Add stock to watchlist
    const watchlistItem = new WatchlistItem({
      userId: req.user.id,
      stockSymbol: uppercaseSymbol
    });
    
    await watchlistItem.save();
    
    // Get the stock data to return
    const stock = await Stock.findOne({ symbol: uppercaseSymbol });
    
    res.status(201).json({
      item: watchlistItem,
      stock
    });
  } catch (err) {
    console.error('Add to watchlist error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove stock from watchlist
exports.removeFromWatchlist = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the watchlist item
    const watchlistItem = await WatchlistItem.findById(id);
    
    // Check if item exists
    if (!watchlistItem) {
      return res.status(404).json({ message: 'Watchlist item not found' });
    }
    
    // Check if item belongs to the current user
    if (watchlistItem.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Remove the item
    await WatchlistItem.findByIdAndRemove(id);
    
    res.json({ success: true });
  } catch (err) {
    console.error('Remove from watchlist error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};