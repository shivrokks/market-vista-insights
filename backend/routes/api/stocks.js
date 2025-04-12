const express = require('express');
const router = express.Router();
const stockController = require('../../controllers/stockController');

// @route   GET api/stocks/market-overview
// @desc    Get market overview data
// @access  Public
router.get('/market-overview', stockController.getMarketOverview);

// @route   GET api/stocks/search
// @desc    Search for stocks
// @access  Public
router.get('/search', stockController.searchStocks);

// @route   GET api/stocks/:symbol
// @desc    Get detailed stock information
// @access  Public
router.get('/:symbol', stockController.getStockDetails);

module.exports = router;