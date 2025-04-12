const Stock = require('../models/Stock');
const HistoricalData = require('../models/HistoricalData');
const axios = require('axios');
const config = require('../config/default');

// Cache mechanism
const cache = {
  data: {},
  lastUpdated: {}
};

// Check if cache is valid for a given key
const isCacheValid = (key) => {
  return (
    cache.data[key] &&
    cache.lastUpdated[key] &&
    Date.now() - cache.lastUpdated[key] < config.cacheTimeout
  );
};

// Function to fetch data from Finnhub API
async function fetchFinnhubData(endpoint, params = {}) {
  try {
    const response = await axios.get(`https://finnhub.io/api/v1${endpoint}`, {
      params: {
        token: config.finnhubApiKey,
        ...params
      }
    });
    return response.data;
  } catch (error) {
    console.error('Finnhub API error:', error.message);
    throw error;
  }
}

// Function to fetch data from Alpha Vantage API
async function fetchAlphaVantageData(function_name, params = {}) {
  try {
    const response = await axios.get(`https://www.alphavantage.co/query`, {
      params: {
        function: function_name,
        apikey: config.alphaVantageApiKey,
        ...params
      }
    });
    return response.data;
  } catch (error) {
    console.error('Alpha Vantage API error:', error.message);
    throw error;
  }
}

// Transform stock quote from Finnhub format to our format
function transformStockQuote(symbol, quote, profile) {
  return {
    symbol: symbol,
    name: profile?.name || symbol,
    price: quote.c,
    change: quote.d,
    changePercent: quote.dp,
    volume: quote.v,
    marketCap: profile?.marketCapitalization ? profile.marketCapitalization * 1000000 : 0,
    sector: profile?.finnhubIndustry || "",
    lastUpdated: new Date()
  };
}

// Transform historical data from Alpha Vantage format to our format
function transformHistoricalData(symbol, timeSeriesData) {
  const result = [];
  // Alpha Vantage returns data as "Time Series (Daily)" with dates as keys
  const timeSeries = timeSeriesData["Time Series (Daily)"];
  
  if (!timeSeries) {
    return result;
  }
  
  for (const [dateStr, data] of Object.entries(timeSeries)) {
    result.push({
      symbol: symbol,
      date: new Date(dateStr),
      open: parseFloat(data["1. open"]),
      high: parseFloat(data["2. high"]),
      low: parseFloat(data["3. low"]),
      close: parseFloat(data["4. close"]),
      volume: parseInt(data["5. volume"])
    });
  }
  
  return result;
}

// Get market overview data
exports.getMarketOverview = async (req, res) => {
  try {
    const cacheKey = 'market-overview';
    
    // Check cache first
    if (isCacheValid(cacheKey)) {
      return res.json(cache.data[cacheKey]);
    }
    
    // Define indices, top gaining and losing symbols
    const indices = ['SPY', 'QQQ', 'DIA']; // ETFs that track major indices
    const popularStocks = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 'TSLA', 'NVDA', 'JPM', 'V', 'WMT'];
    
    // Fetch data for all symbols
    const allSymbols = [...indices, ...popularStocks];
    const stockDataPromises = allSymbols.map(async (symbol) => {
      // Get quote data
      const quote = await fetchFinnhubData('/quote', { symbol });
      
      // Get company profile
      const profile = await fetchFinnhubData('/stock/profile2', { symbol });
      
      return transformStockQuote(symbol, quote, profile);
    });
    
    const allStocks = await Promise.all(stockDataPromises);
    
    // Process data and save to database
    for (const stockData of allStocks) {
      await Stock.findOneAndUpdate(
        { symbol: stockData.symbol },
        stockData,
        { upsert: true, new: true }
      );
    }
    
    // Get indices from the fetched data
    const indicesData = allStocks.filter(stock => indices.includes(stock.symbol));
    
    // Sort by change percentage for gainers and losers
    const sortedByChange = [...allStocks].sort((a, b) => b.changePercent - a.changePercent);
    const topGainers = sortedByChange.slice(0, 3);
    const topLosers = sortedByChange.reverse().slice(0, 3);
    
    const marketData = {
      indices: indicesData,
      topGainers,
      topLosers
    };
    
    // Cache the result
    cache.data[cacheKey] = marketData;
    cache.lastUpdated[cacheKey] = Date.now();
    
    res.json(marketData);
  } catch (err) {
    console.error('Market overview error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get detailed stock information
exports.getStockDetails = async (req, res) => {
  try {
    const { symbol } = req.params;
    const uppercaseSymbol = symbol.toUpperCase();
    const cacheKey = `stock-details-${uppercaseSymbol}`;
    
    // Check cache first
    if (isCacheValid(cacheKey)) {
      return res.json(cache.data[cacheKey]);
    }
    
    // Fetch quote data from Finnhub
    const quote = await fetchFinnhubData('/quote', { symbol: uppercaseSymbol });
    
    // Fetch company profile from Finnhub
    const profile = await fetchFinnhubData('/stock/profile2', { symbol: uppercaseSymbol });
    
    // Fetch historical data from Alpha Vantage
    const historicalData = await fetchAlphaVantageData('TIME_SERIES_DAILY', {
      symbol: uppercaseSymbol,
      outputsize: 'compact' // Last 100 data points
    });
    
    // Transform data
    const stockDetails = transformStockQuote(uppercaseSymbol, quote, profile);
    const historicalPoints = transformHistoricalData(uppercaseSymbol, historicalData);
    
    // Update stock details in database
    await Stock.findOneAndUpdate(
      { symbol: uppercaseSymbol },
      stockDetails,
      { upsert: true, new: true }
    );
    
    // Update historical data in database
    for (const dataPoint of historicalPoints) {
      await HistoricalData.findOneAndUpdate(
        { symbol: dataPoint.symbol, date: dataPoint.date },
        dataPoint,
        { upsert: true, new: true }
      );
    }
    
    const stockData = {
      details: stockDetails,
      historicalData: historicalPoints
    };
    
    // Cache the result
    cache.data[cacheKey] = stockData;
    cache.lastUpdated[cacheKey] = Date.now();
    
    res.json(stockData);
  } catch (err) {
    console.error(`Stock details error for ${req.params.symbol}:`, err.message);
    
    // Handle not found case
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ message: 'Stock symbol not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Search for stocks
exports.searchStocks = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const cacheKey = `search-${q}`;
    
    // Check cache first
    if (isCacheValid(cacheKey)) {
      return res.json(cache.data[cacheKey]);
    }
    
    // Search stocks using Finnhub
    const searchResults = await fetchFinnhubData('/search', { q });
    
    if (!searchResults.result || searchResults.result.length === 0) {
      return res.json([]);
    }
    
    // Get detailed information for top 5 results
    const symbols = searchResults.result.slice(0, 5).map(item => item.symbol);
    
    const stockDetailsPromises = symbols.map(async (symbol) => {
      try {
        const quote = await fetchFinnhubData('/quote', { symbol });
        const profile = await fetchFinnhubData('/stock/profile2', { symbol });
        
        return transformStockQuote(symbol, quote, profile);
      } catch (err) {
        console.error(`Error fetching details for ${symbol}:`, err.message);
        return null;
      }
    });
    
    // Filter out any failed lookups
    const stocks = (await Promise.all(stockDetailsPromises)).filter(stock => stock !== null);
    
    // Save to database
    for (const stock of stocks) {
      await Stock.findOneAndUpdate(
        { symbol: stock.symbol },
        stock,
        { upsert: true, new: true }
      );
    }
    
    // Cache the result
    cache.data[cacheKey] = stocks;
    cache.lastUpdated[cacheKey] = Date.now();
    
    res.json(stocks);
  } catch (err) {
    console.error('Stock search error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};