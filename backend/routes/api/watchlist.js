const express = require("express");
const router = express.Router();
const { addToWatchlist, getWatchlistItems } = require("../../controllers/watchlistController");

// Add stock to watchlist
router.post("/", addToWatchlist);

// Get all watchlist items for a user
router.get("/:userId", getWatchlistItems);

module.exports = router;