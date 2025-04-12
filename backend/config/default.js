module.exports = {
  mongoURI: "mongodb+srv://meetrocks31:KvqNL7xMD2BAp4bd@stockhack.z5movr9.mongodb.net/",
  finnhubApiKey: "YOUR_FINNHUB_API_KEY", // Replace with your actual Finnhub API key
  alphaVantageApiKey: "4U7RRNDB7TJ78COU", // Replace with your actual Alpha Vantage API key
  jwtSecret: "your_jwt_secret_key", // In production, use environment variables
  jwtExpiration: "24h",
  cacheTimeout: 60000 // 1 minute cache timeout
};