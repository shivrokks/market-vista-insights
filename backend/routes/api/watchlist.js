const express = require('express');
const router = express.Router();
const watchlistController = require('../../controllers/watchlistController');
const auth = require('../../middleware/auth');

// All watchlist routes require authentication
router.use(auth);

// @route   GET api/watchlist
// @desc    Get user's watchlist
// @access  Private
router.get('/', watchlistController.getWatchlist);

// @route   POST api/watchlist
// @desc    Add stock to watchlist
// @access  Private
router.post('/', watchlistController.addToWatchlist);

// @route   DELETE api/watchlist/:id
// @desc    Remove stock from watchlist
// @access  Private
router.delete('/:id', watchlistController.removeFromWatchlist);

module.exports = router;