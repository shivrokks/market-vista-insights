
import { toast } from "@/components/ui/use-toast";

// Base API URL - update this to your Node.js server URL
const API_URL = "http://localhost:5000/api";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  token?: string;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector?: string;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  stockSymbol: string;
  dateAdded: string;
}

// Generic API request handler with error handling
async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    // Get auth token from local storage
    const token = localStorage.getItem("authToken");
    
    // Default headers
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };
    
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }
    
    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to complete request",
      variant: "destructive",
    });
    throw error;
  }
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<User> => {
    return apiRequest<User>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  
  register: async (name: string, email: string, password: string): Promise<User> => {
    return apiRequest<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },
  
  getCurrentUser: async (): Promise<User> => {
    return apiRequest<User>("/auth/me");
  },
  
  logout: () => {
    localStorage.removeItem("authToken");
  },
};

// Stocks API
export const stocksAPI = {
  getMarketOverview: async (): Promise<{ indices: Stock[], topGainers: Stock[], topLosers: Stock[] }> => {
    return apiRequest<{ indices: Stock[], topGainers: Stock[], topLosers: Stock[] }>("/stocks/market-overview");
  },
  
  getStockDetails: async (symbol: string): Promise<{ details: Stock, historicalData: any[] }> => {
    return apiRequest<{ details: Stock, historicalData: any[] }>(`/stocks/${symbol}`);
  },
  
  searchStocks: async (query: string, filter?: string): Promise<Stock[]> => {
    const queryParams = new URLSearchParams();
    queryParams.append("q", query);
    if (filter) queryParams.append("filter", filter);
    return apiRequest<Stock[]>(`/stocks/search?${queryParams.toString()}`);
  },
};

// Watchlist API
export const watchlistAPI = {
  getWatchlist: async (): Promise<{ items: WatchlistItem[], stocks: Stock[] }> => {
    return apiRequest<{ items: WatchlistItem[], stocks: Stock[] }>("/watchlist");
  },
  
  addToWatchlist: async (symbol: string): Promise<WatchlistItem> => {
    return apiRequest<WatchlistItem>("/watchlist", {
      method: "POST",
      body: JSON.stringify({ symbol }),
    });
  },
  
  removeFromWatchlist: async (id: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/watchlist/${id}`, {
      method: "DELETE",
    });
  },
};

// Mock data function for development (until backend is connected)
export const getMockData = {
  marketOverview: (): { indices: Stock[], topGainers: Stock[], topLosers: Stock[] } => {
    return {
      indices: [
        { symbol: "PULZ", name: "PULZ", date: "11-Apr-25", price: 45.5, change: -0.5, changePercent: -1.09, volume: 10000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "09-Apr-25", price: 46, change: 1, changePercent: 2.22, volume: 6000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "08-Apr-25", price: 45, change: -1.05, changePercent: -2.28, volume: 30000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "04-Apr-25", price: 46, change: -1.75, changePercent: -3.66, volume: 16000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "03-Apr-25", price: 47.75, change: 2.25, changePercent: 4.95, volume: 48000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "02-Apr-25", price: 45.5, change: 2.05, changePercent: 4.72, volume: 6000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "01-Apr-25", price: 43.45, change: 1.7, changePercent: 4.07, volume: 16000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "28-Mar-25", price: 41.75, change: -1.75, changePercent: -4.02, volume: 24000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "27-Mar-25", price: 43.5, change: -1.85, changePercent: -4.08, volume: 18000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "26-Mar-25", price: 45.5, change: -1, changePercent: -2.15, volume: 24000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "25-Mar-25", price: 46.5, change: 0.15, changePercent: 0.32, volume: 14000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "24-Mar-25", price: 47.25, change: 2.25, changePercent: 5.0, volume: 64000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "21-Mar-25", price: 45, change: 1.1, changePercent: 2.51, volume: 22000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "20-Mar-25", price: 43.9, change: 2.05, changePercent: 4.9, volume: 16000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "19-Mar-25", price: 41.85, change: 1.95, changePercent: 4.89, volume: 10000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "18-Mar-25", price: 39.9, change: 0.85, changePercent: 2.18, volume: 36000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "17-Mar-25", price: 39.25, change: -0.8, changePercent: -2.0, volume: 60000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "13-Mar-25", price: 40.5, change: -0.2, changePercent: -0.49, volume: 26000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "12-Mar-25", price: 40.7, change: -2.15, changePercent: -5.02, volume: 18000, marketCap: 0 },
      ],
      topGainers: [
        { symbol: "PULZ", name: "PULZ", date: "11-Apr-25", price: 45.5, change: -0.5, changePercent: -1.09, volume: 10000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "09-Apr-25", price: 46, change: 1, changePercent: 2.22, volume: 6000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "08-Apr-25", price: 45, change: -1.05, changePercent: -2.28, volume: 30000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "04-Apr-25", price: 46, change: -1.75, changePercent: -3.66, volume: 16000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "03-Apr-25", price: 47.75, change: 2.25, changePercent: 4.95, volume: 48000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "02-Apr-25", price: 45.5, change: 2.05, changePercent: 4.72, volume: 6000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "01-Apr-25", price: 43.45, change: 1.7, changePercent: 4.07, volume: 16000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "28-Mar-25", price: 41.75, change: -1.75, changePercent: -4.02, volume: 24000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "27-Mar-25", price: 43.5, change: -1.85, changePercent: -4.08, volume: 18000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "26-Mar-25", price: 45.5, change: -1, changePercent: -2.15, volume: 24000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "25-Mar-25", price: 46.5, change: 0.15, changePercent: 0.32, volume: 14000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "24-Mar-25", price: 47.25, change: 2.25, changePercent: 5.0, volume: 64000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "21-Mar-25", price: 45, change: 1.1, changePercent: 2.51, volume: 22000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "20-Mar-25", price: 43.9, change: 2.05, changePercent: 4.9, volume: 16000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "19-Mar-25", price: 41.85, change: 1.95, changePercent: 4.89, volume: 10000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "18-Mar-25", price: 39.9, change: 0.85, changePercent: 2.18, volume: 36000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "17-Mar-25", price: 39.25, change: -0.8, changePercent: -2.0, volume: 60000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "13-Mar-25", price: 40.5, change: -0.2, changePercent: -0.49, volume: 26000, marketCap: 0 },
        { symbol: "PULZ", name: "PULZ", date: "12-Mar-25", price: 40.7, change: -2.15, changePercent: -5.02, volume: 18000, marketCap: 0 },
      ],
      topLosers: [
        { symbol: "META", name: "Meta Platforms", price: 474.36, change: -6.72, changePercent: -1.4, volume: 15800000, marketCap: 1210000000000 },
        { symbol: "TSLA", name: "Tesla, Inc.", price: 175.34, change: -3.45, changePercent: -1.93, volume: 92500000, marketCap: 558000000000 },
        { symbol: "AMZN", name: "Amazon", price: 178.22, change: -2.31, changePercent: -1.28, volume: 36400000, marketCap: 1850000000000 },
      ]
    };
  },
  
  stockDetails: (symbol: string): { details: Stock, historicalData: any[] } => {
    const mockStocks: Record<string, Stock> = {
      "AAPL": { symbol: "AAPL", name: "Apple Inc.", price: 169.58, change: 4.38, changePercent: 2.65, volume: 76500000, marketCap: 2650000000000, sector: "Technology" },
      "MSFT": { symbol: "MSFT", name: "Microsoft", price: 425.52, change: 8.97, changePercent: 2.15, volume: 28900000, marketCap: 3160000000000, sector: "Technology" },
      "NVDA": { symbol: "NVDA", name: "NVIDIA", price: 881.86, change: 15.37, changePercent: 1.77, volume: 42300000, marketCap: 2170000000000, sector: "Technology" },
      "META": { symbol: "META", name: "Meta Platforms", price: 474.36, change: -6.72, changePercent: -1.4, volume: 15800000, marketCap: 1210000000000, sector: "Technology" },
      "TSLA": { symbol: "TSLA", name: "Tesla, Inc.", price: 175.34, change: -3.45, changePercent: -1.93, volume: 92500000, marketCap: 558000000000, sector: "Automotive" },
      "AMZN": { symbol: "AMZN", name: "Amazon", price: 178.22, change: -2.31, changePercent: -1.28, volume: 36400000, marketCap: 1850000000000, sector: "Consumer Cyclical" },
    };
    
    const stock = mockStocks[symbol] || {
      symbol,
      name: `Unknown Stock (${symbol})`,
      price: 100,
      change: 0,
      changePercent: 0,
      volume: 0,
      marketCap: 0,
    };
    
    // Generate mock historical data
    const historicalData = [];
    const today = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const basePrice = 100;
      const randomFactor = 0.1; // 10% variation
      const priceVariation = basePrice * randomFactor * (Math.random() - 0.5);
      
      historicalData.push({
        date: date.toISOString().split('T')[0],
        price: basePrice + priceVariation,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
      });
    }
    
    return { details: stock, historicalData };
  },
  
  searchStocks: (query: string): Stock[] => {
    const allStocks = [
      { symbol: "AAPL", name: "Apple Inc.", price: 169.58, change: 4.38, changePercent: 2.65, volume: 76500000, marketCap: 2650000000000 },
      { symbol: "MSFT", name: "Microsoft", price: 425.52, change: 8.97, changePercent: 2.15, volume: 28900000, marketCap: 3160000000000 },
      { symbol: "GOOGL", name: "Alphabet Inc.", price: 152.50, change: 2.85, changePercent: 1.90, volume: 22900000, marketCap: 1900000000000 },
      { symbol: "AMZN", name: "Amazon", price: 178.22, change: -2.31, changePercent: -1.28, volume: 36400000, marketCap: 1850000000000 },
      { symbol: "NVDA", name: "NVIDIA", price: 881.86, change: 15.37, changePercent: 1.77, volume: 42300000, marketCap: 2170000000000 },
      { symbol: "META", name: "Meta Platforms", price: 474.36, change: -6.72, changePercent: -1.4, volume: 15800000, marketCap: 1210000000000 },
      { symbol: "TSLA", name: "Tesla, Inc.", price: 175.34, change: -3.45, changePercent: -1.93, volume: 92500000, marketCap: 558000000000 },
      { symbol: "BRK-B", name: "Berkshire Hathaway", price: 407.68, change: 3.24, changePercent: 0.80, volume: 3900000, marketCap: 890000000000 },
      { symbol: "JPM", name: "JPMorgan Chase", price: 196.46, change: 2.56, changePercent: 1.32, volume: 8700000, marketCap: 565000000000 },
      { symbol: "V", name: "Visa Inc.", price: 276.96, change: 1.98, changePercent: 0.72, volume: 5600000, marketCap: 560000000000 },
    ];
    
    if (!query) return allStocks;
    
    const lowerQuery = query.toLowerCase();
    return allStocks.filter(
      stock => stock.symbol.toLowerCase().includes(lowerQuery) || 
               stock.name.toLowerCase().includes(lowerQuery)
    );
  },
  
  watchlist: (): { items: WatchlistItem[], stocks: Stock[] } => {
    const items: WatchlistItem[] = [
      { id: "1", userId: "user1", stockSymbol: "AAPL", dateAdded: new Date().toISOString() },
      { id: "2", userId: "user1", stockSymbol: "MSFT", dateAdded: new Date().toISOString() },
      { id: "3", userId: "user1", stockSymbol: "NVDA", dateAdded: new Date().toISOString() },
    ];
    
    const stocks: Stock[] = [
      { symbol: "AAPL", name: "Apple Inc.", price: 169.58, change: 4.38, changePercent: 2.65, volume: 76500000, marketCap: 2650000000000 },
      { symbol: "MSFT", name: "Microsoft", price: 425.52, change: 8.97, changePercent: 2.15, volume: 28900000, marketCap: 3160000000000 },
      { symbol: "NVDA", name: "NVIDIA", price: 881.86, change: 15.37, changePercent: 1.77, volume: 42300000, marketCap: 2170000000000 },
    ];
    
    return { items, stocks };
  },
};
