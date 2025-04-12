
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import StockCard from "@/components/StockCard";
import StockChart from "@/components/StockChart";
import { useToast } from "@/components/ui/use-toast";
import { getMockData, stocksAPI, watchlistAPI, Stock } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Search, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [marketData, setMarketData] = useState<{
    indices: Stock[];
    topGainers: Stock[];
    topLosers: Stock[];
  }>({
    indices: [],
    topGainers: [],
    topLosers: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredStock, setFeaturedStock] = useState<{
    stock: Stock;
    historicalData: any[];
  } | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      setIsLoading(true);
      try {
        // For demonstration, we're using mock data
        // In a real app, this would call the API
        // const data = await stocksAPI.getMarketOverview();
        const data = getMockData.marketOverview();
        setMarketData(data);
        
        // Get featured stock data (Apple in this example)
        const featuredStockData = getMockData.stockDetails("AAPL");
        setFeaturedStock(featuredStockData);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
        toast({
          title: "Error",
          description: "Failed to load market data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, [toast]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAddToWatchlist = async (symbol: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to add stocks to your watchlist",
      });
      navigate("/login");
      return;
    }

    try {
      // In a real app, call the API
      // await watchlistAPI.addToWatchlist(symbol);
      
      toast({
        title: "Added to watchlist",
        description: `${symbol} has been added to your watchlist`,
      });
    } catch (error) {
      console.error("Failed to add to watchlist:", error);
      toast({
        title: "Error",
        description: "Failed to add stock to watchlist",
        variant: "destructive",
      });
    }
  };

  // Placeholder loading state
  if (isLoading || authLoading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center py-16">
            <div className="animate-pulse space-y-8 w-full">
              <div className="h-48 bg-gray-200 rounded-lg w-full"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        {/* Hero Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl p-6 md:p-8">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Market Vista Insights
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Track stocks, analyze market trends, and build your custom watchlist
              </p>
              <form onSubmit={handleSearch} className="flex max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input
                    type="search"
                    placeholder="Search for stocks by name or symbol..."
                    className="pl-10 pr-4 py-2 rounded-l-lg w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" className="rounded-l-none">
                  Search
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Market Indices */}
        <section className="mb-8">
          <h2 className="section-title">Market Indices</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketData.indices.map((index) => (
              <StockCard key={index.symbol} stock={index} />
            ))}
          </div>
        </section>
        
        {/* Featured Stock Chart */}
        {featuredStock && (
          <section className="mb-8">
            <h2 className="section-title">Featured Stock</h2>
            <StockChart
              data={featuredStock.historicalData}
              symbol={featuredStock.stock.symbol}
              name={featuredStock.stock.name}
              isPositive={featuredStock.stock.change >= 0}
            />
          </section>
        )}
        
        {/* Top Movers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Gainers */}
          <section>
            <div className="flex items-center mb-4">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              <h2 className="section-title m-0">Top Gainers</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {marketData.topGainers.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  onAddToWatchlist={handleAddToWatchlist}
                  showAddButton={!!user}
                />
              ))}
            </div>
          </section>

          {/* Top Losers */}
          <section>
            <div className="flex items-center mb-4">
              <TrendingDown className="h-5 w-5 text-red-600 mr-2" />
              <h2 className="section-title m-0">Top Losers</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {marketData.topLosers.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  onAddToWatchlist={handleAddToWatchlist}
                  showAddButton={!!user}
                />
              ))}
            </div>
          </section>
        </div>
        
        {/* Call to Action */}
        {!user && (
          <section>
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-semibold mb-2">Create Your Personal Watchlist</h3>
                    <p className="text-gray-600">
                      Track your favorite stocks and get personalized insights
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={() => navigate("/login")}>
                      Sign In
                    </Button>
                    <Button onClick={() => navigate("/register")}>
                      Create Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Market Vista Insights. All rights reserved.
            </p>
            <p className="mt-2">
              Market data provided for informational purposes only. Not financial advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
