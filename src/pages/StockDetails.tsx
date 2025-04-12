
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import StockChart from "@/components/StockChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { getMockData, stocksAPI, watchlistAPI, Stock } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  StarIcon,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  DollarSign,
  Info,
  Building,
  Globe,
  ChevronLeft,
} from "lucide-react";
import { format } from "date-fns";

const StockDetails = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stockData, setStockData] = useState<{
    details: Stock;
    historicalData: any[];
  } | null>(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false);

  useEffect(() => {
    const fetchStockData = async () => {
      if (!symbol) return;

      setIsLoading(true);
      try {
        // For demonstration, we're using mock data
        // In a real app, this would call the API
        // const data = await stocksAPI.getStockDetails(symbol);
        const data = getMockData.stockDetails(symbol);
        setStockData(data);
        
        // Check if stock is in user's watchlist (mock)
        setIsInWatchlist(Math.random() > 0.5); // Random for demo
      } catch (error) {
        console.error(`Failed to fetch stock data for ${symbol}:`, error);
        toast({
          title: "Error",
          description: "Failed to load stock data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockData();
  }, [symbol, toast]);

  const handleToggleWatchlist = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to manage your watchlist",
      });
      navigate("/login");
      return;
    }

    if (!symbol) return;

    try {
      setIsAddingToWatchlist(true);
      
      // In a real app, call the API
      // if (isInWatchlist) {
      //   await watchlistAPI.removeFromWatchlist(symbol);
      // } else {
      //   await watchlistAPI.addToWatchlist(symbol);
      // }
      
      // Toggle for demo
      setIsInWatchlist(!isInWatchlist);
      
      toast({
        title: isInWatchlist ? "Removed from watchlist" : "Added to watchlist",
        description: `${symbol} has been ${isInWatchlist ? "removed from" : "added to"} your watchlist`,
      });
    } catch (error) {
      console.error("Failed to update watchlist:", error);
      toast({
        title: "Error",
        description: "Failed to update watchlist",
        variant: "destructive",
      });
    } finally {
      setIsAddingToWatchlist(false);
    }
  };

  // Format large numbers with commas and appropriate suffixes
  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    }
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }
    return num.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    });
  };

  // Placeholder loading state
  if (isLoading || !stockData) {
    return (
      <div>
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const { details, historicalData } = stockData;
  const isPositive = details.change >= 0;
  const changeClass = isPositive ? "text-green-600" : "text-red-600";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        {/* Back button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="pl-0" 
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>
        
        {/* Stock header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              {details.symbol}
              <span className="text-lg md:text-xl font-normal text-gray-500 ml-2">
                {details.name}
              </span>
            </h1>
            <div className="flex items-center mt-2">
              <span className="text-2xl font-semibold mr-3">
                ${details.price.toFixed(2)}
              </span>
              <span className={`flex items-center ${changeClass}`}>
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span className="font-medium">
                  {isPositive ? "+" : ""}
                  {details.change.toFixed(2)} ({Math.abs(details.changePercent).toFixed(2)}%)
                </span>
              </span>
              <span className="ml-3 text-sm text-gray-500">
                Last updated: {format(new Date(), "MMM d, yyyy, h:mm a")}
              </span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button
              onClick={handleToggleWatchlist}
              variant={isInWatchlist ? "outline" : "default"}
              disabled={isAddingToWatchlist}
              className={isInWatchlist ? "border-primary text-primary" : ""}
            >
              <StarIcon className={`h-4 w-4 mr-2 ${isInWatchlist ? "fill-primary" : ""}`} />
              {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
            </Button>
          </div>
        </div>
        
        {/* Stock chart */}
        <section className="mb-8">
          <StockChart
            data={historicalData}
            symbol={details.symbol}
            name={details.name}
            isPositive={isPositive}
          />
        </section>
        
        {/* Key metrics */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Volume</p>
                    <p className="text-lg font-semibold">
                      {details.volume.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Market Cap</p>
                    <p className="text-lg font-semibold">
                      {formatNumber(details.marketCap)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Sector</p>
                    <p className="text-lg font-semibold">
                      {details.sector || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">52W Range</p>
                    <p className="text-lg font-semibold">
                      ${(details.price * 0.8).toFixed(2)} - ${(details.price * 1.2).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Tabs for additional information */}
        <section>
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    {details.name} ({details.symbol}) is a company operating in the {details.sector || "technology"} sector.
                    The company has shown {isPositive ? "positive" : "negative"} performance with a {Math.abs(details.changePercent).toFixed(2)}% {isPositive ? "gain" : "loss"} recently.
                    This is placeholder text that would be replaced with actual company information from the API.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Trading Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Open</p>
                      <p>${(details.price - (Math.random() * 2 - 1)).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Previous Close</p>
                      <p>${(details.price - details.change).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Day's Range</p>
                      <p>${(details.price * 0.98).toFixed(2)} - ${(details.price * 1.02).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Volume</p>
                      <p>{details.volume.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Avg. Volume</p>
                      <p>{(details.volume * 1.1).toFixed(0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Market Cap</p>
                      <p>{formatNumber(details.marketCap)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="financials">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Financial data would be displayed here, including quarterly earnings,
                    revenue growth, profit margins, and other key financial metrics.
                    This is a placeholder as we don't have real financial data in the mock API.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="news">
              <Card>
                <CardHeader>
                  <CardTitle>Latest News</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    News articles related to {details.symbol} would appear here.
                    The news would include recent developments, earnings reports,
                    and other important events affecting the company.
                    This is a placeholder as we don't have real news data in the mock API.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analysis">
              <Card>
                <CardHeader>
                  <CardTitle>Analyst Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Analyst recommendations and price targets would be displayed here.
                    This would include buy/sell ratings from various financial institutions
                    and their outlook on the stock.
                    This is a placeholder as we don't have real analyst data in the mock API.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-8">
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

export default StockDetails;
