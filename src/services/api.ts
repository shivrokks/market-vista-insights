
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
    return apiRequest<{ items: WatchlistItem[], stocks: Stock[] }>("/watchlist/67f9f321d891439a83a148ad");
  },
  
  addToWatchlist: async (symbol: string): Promise<WatchlistItem> => {
    return apiRequest<WatchlistItem>("/watchlist/67f9f321d891439a83a148ad", {
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
// Mock data function for development (until backend is connected)
export const getMockData = {
  marketOverview: (): { indices: Stock[], topGainers: Stock[], topLosers: Stock[] } => {
    return {
      indices: [
        { symbol: "AIRTEL", name: "Bharti Airtel Ltd.", price: 1715.55, change: -0.28, changePercent: -0.02, volume: 9907628, marketCap: 1047400.28 },
        { symbol: "IDEA", name: "Vodafone Idea Ltd.", price: 12.34, change: 0.12, changePercent: 0.98, volume: 1234567, marketCap: 23456.78 },
        { symbol: "TATA COMM", name: "Tata Communications Ltd.", price: 1050.50, change: -5.00, changePercent: -0.47, volume: 2345678, marketCap: 34567.89 },
        { symbol: "TEJAS NET", name: "Tejas Networks Ltd.", price: 350.75, change: 5.50, changePercent: 1.59, volume: 3456789, marketCap: 45678.90 },
        { symbol: "CENTUM", name: "Centum Electronics Ltd.", price: 450.25, change: -2.25, changePercent: -0.50, volume: 4567890, marketCap: 56789.01 },
        { symbol: "CYIENT", name: "Cyient Ltd.", price: 550.00, change: 10.00, changePercent: 1.85, volume: 5678901, marketCap: 67890.12 },
        { symbol: "PGEL", name: "PG Electroplast Ltd.", price: 150.50, change: -1.50, changePercent: -0.99, volume: 6789012, marketCap: 78901.23 },
        { symbol: "PULZ", name: "Pulses Inc.", price: 76.01, change: 0.95, changePercent: 1.26, volume: 6031521, marketCap: 0 },
        { symbol: "BPL", name: "BPL Ltd.", price: 200.00, change: 2.00, changePercent: 1.01, volume: 7890123, marketCap: 89012.34 },
        { symbol: "BAJFIN", name: "Bajaj Finance Ltd.", price: 8000.00, change: -50.00, changePercent: -0.62, volume: 8901234, marketCap: 90123.45 },
        { symbol: "CSLFIN", name: "CSL Finance Ltd.", price: 300.00, change: 3.00, changePercent: 1.01, volume: 9012345, marketCap: 12345.67 },
        { symbol: "TCIFIN", name: "TCI Finance Ltd.", price: 250.00, change: -2.00, changePercent: -0.80, volume: 1234567, marketCap: 23456.78 },
        { symbol: "VLSFIN", name: "VLS Finance Ltd.", price: 100.00, change: 1.00, changePercent: 1.00, volume: 2345678, marketCap: 34567.89 },
        { symbol: "HCLTECH", name: "HCL Technologies Ltd.", price: 1000.00, change: -10.00, changePercent: -0.99, volume: 3456789, marketCap: 45678.90 },
        { symbol: "INFY", name: "Infosys Ltd.", price: 1500.00, change: 15.00, changePercent: 1.01, volume: 4567890, marketCap: 56789.01 },
        { symbol: "RELI", name: "Reliance Industries Ltd.", price: 2000.00, change: -20.00, changePercent: -0.99, volume: 5678901, marketCap: 67890.12 },
        { symbol: "TCS", name: "Tata Consultancy Services Ltd.", price: 3000.00, change: 30.00, changePercent: 1.01, volume: 6789012, marketCap: 78901.23 },
        { symbol: "WIPRO", name: "Wipro Ltd.", price: 400.00, change: -4.00, changePercent: -0.99, volume: 7890123, marketCap: 89012.34 },
        { symbol: "BPCL", name: "Bharat Petroleum Corp. Ltd.", price: 500.00, change: 5.00, changePercent: 1.01, volume: 8901234, marketCap: 90123.45 },
        { symbol: "CASTROL", name: "Castrol India Ltd.", price: 150.00, change: -1.50, changePercent: -0.99, volume: 9012345, marketCap: 12345.67 },
        { symbol: "DEEPINDS", name: "Deep Industries Ltd.", price: 200.00, change: 2.00, changePercent: 1.01, volume: 2345678, marketCap: 34567.89 },
        { symbol: "GAIL", name: "GAIL (India) Ltd.", price: 300.00, change: -3.00, changePercent: -0.99, volume: 3456789, marketCap: 45678.90 },
        { symbol: "JINDIL", name: "Jindal Drilling & Industries Ltd.", price: 350.00, change: 3.00, changePercent: 0.86, volume: 4567890, marketCap: 56789.01 },
        { symbol: "ADANIGREEN", name: "Adani Green Energy Ltd.", price: 400.00, change: -4.00, changePercent: -0.99, volume: 5678901, marketCap: 67890.12 },
        { symbol: "JSWENE", name: "JSW Energy Ltd.", price: 450.00, change: 4.50, changePercent: 1.01, volume: 6789012, marketCap: 78901.23 },
        { symbol: "KPIGR", name: "KPI Green Energy Ltd.", price: 500.00, change: -5.00, changePercent: -0, volume: 6031521, marketCap: 0 }
      ],
      topGainers: [
        { symbol: "CYIENT", name: "Cyient Ltd.", price: 550.00, change: 10.00, changePercent: 1.85, volume: 5678901, marketCap: 67890.12 },
        { symbol: "INFY", name: "Infosys Ltd.", price: 1500.00, change: 15.00, changePercent: 1.01, volume: 4567890, marketCap: 56789.01 },
        { symbol: "TCS", name: "Tata Consultancy Services Ltd.", price: 3000.00, change: 30.00, changePercent: 1.01, volume: 6789012, marketCap: 78901.23 },
        { symbol: "TEJAS NET", name: "Tejas Networks Ltd.", price: 350.75, change: 5.50, changePercent: 1.59, volume: 3456789, marketCap: 45678.90 },
        { symbol: "BPL", name: "BPL Ltd.", price: 200.00, change: 2.00, changePercent: 1.01, volume: 7890123, marketCap: 89012.34 }
      ],
      topLosers: [
        { symbol: "BAJFIN", name: "Bajaj Finance Ltd.", price: 8000.00, change: -50.00, changePercent: -0.62, volume: 8901234, marketCap: 90123.45 },
        { symbol: "RELI", name: "Reliance Industries Ltd.", price: 2000.00, change: -20.00, changePercent: -0.99, volume: 5678901, marketCap: 67890.12 },
        { symbol: "HCLTECH", name: "HCL Technologies Ltd.", price: 1000.00, change: -10.00, changePercent: -0.99, volume: 3456789, marketCap: 45678.90 },
        { symbol: "BPCL", name: "Bharat Petroleum Corp. Ltd.", price: 500.00, change: 5.00, changePercent: 1.01, volume: 8901234, marketCap: 90123.45 },
        { symbol: "ADANIGREEN", name: "Adani Green Energy Ltd.", price: 400.00, change: -4.00, changePercent: -0.99, volume: 5678901, marketCap: 67890.12 }
      ]
    };
  },

  stockDetails: (symbol: string): { details: Stock, historicalData: any[] } => {
    const mockStocks: Record<string, Stock> = {
      "PULZ": { symbol: "PULZ", name: "PULZ", price: 76.01, change: 0.95, changePercent: 1.26, volume: 6031521, marketCap: 0, sector: "Textiles" },
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
      const basePrice = stock.price || 100;
      const randomFactor = 0.1;
      const priceVariation = basePrice * randomFactor * (Math.random() - 0.5);

      historicalData.push({
        date: date.toISOString().split('T')[0],
        price: +(basePrice + priceVariation).toFixed(2),
        volume: Math.floor(Math.random() * 10000000) + 1000000,
      });
    }

    return { details: stock, historicalData };
  },

  searchStocks: (query: string): Stock[] => {
    const allStocks = [
      { symbol: "PULZ", name: "PULZ", price: 76.01, change: 0.95, changePercent: 1.26, volume: 6031521, marketCap: 0 },
      { symbol: "META", name: "Meta Platforms", price: 474.36, change: -6.72, changePercent: -1.4, volume: 15800000, marketCap: 1210000000000 },
      { symbol: "TSLA", name: "Tesla, Inc.", price: 175.34, change: -3.45, changePercent: -1.93, volume: 92500000, marketCap: 558000000000 },
      { symbol: "AMZN", name: "Amazon", price: 178.22, change: -2.31, changePercent: -1.28, volume: 36400000, marketCap: 1850000000000 },
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
      { id: "1", userId: "user1", stockSymbol: "PULZ", dateAdded: new Date().toISOString() },
      { id: "2", userId: "user1", stockSymbol: "META", dateAdded: new Date().toISOString() },
    ];

    const stocks: Stock[] = [
      { symbol: "CYIENT", name: "CYIENT LTD.", price: 550.00, change: 10.00, changePercent: 1.85, volume: 5678901, marketCap: 67890.12},
      { symbol: "HCLTECH", name: "HCL TECH", price: 1000.00, change: -10.00, changePercent: -0.99, volume: 3456789, marketCap: 45678.90 },
    ];

    return { items, stocks };
  },
};
