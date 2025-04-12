
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import StockCard from "@/components/StockCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getMockData, stocksAPI, watchlistAPI, Stock } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Search as SearchIcon, Filter } from "lucide-react";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  // Parse query param on page load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) {
      setSearchQuery(q);
      handleSearch(q, filter);
    }
  }, [location.search]);

  const handleSearch = async (query: string = searchQuery, currentFilter: string = filter) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      // For demonstration, we're using mock data
      // In a real app, this would call the API
      // const results = await stocksAPI.searchStocks(query, filter);
      const results = getMockData.searchStocks(query);
      
      // Apply filters if needed
      let filteredResults = [...results];
      if (currentFilter === "gainers") {
        filteredResults = results.filter(stock => stock.change > 0);
      } else if (currentFilter === "losers") {
        filteredResults = results.filter(stock => stock.change < 0);
      }
      
      setSearchResults(filteredResults);
      
      // Update URL for sharing
      const searchParams = new URLSearchParams();
      searchParams.set("q", query);
      navigate(`${location.pathname}?${searchParams.toString()}`);
    } catch (error) {
      console.error("Search failed:", error);
      toast({
        title: "Search Error",
        description: "Failed to fetch search results",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  const handleFilterChange = (value: string) => {
    setFilter(value);
    handleSearch(searchQuery, value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Search Stocks</h1>
        
        {/* Search form */}
        <div className="mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search for stocks by name or symbol..."
                className="pl-9 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-40">
                <Select value={filter} onValueChange={handleFilterChange}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stocks</SelectItem>
                    <SelectItem value="gainers">Gainers</SelectItem>
                    <SelectItem value="losers">Losers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit">
                Search
              </Button>
            </div>
          </form>
        </div>
        
        {/* Results */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <h2 className="text-lg font-medium">
                Search Results {searchQuery ? `for "${searchQuery}"` : ""}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((stock) => (
                  <StockCard
                    key={stock.symbol}
                    stock={stock}
                    onAddToWatchlist={handleAddToWatchlist}
                    showAddButton={!!user}
                  />
                ))}
              </div>
            </>
          ) : searchQuery ? (
            <div className="text-center py-12">
              <SearchIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No results found for "{searchQuery}"</p>
              <p className="text-gray-500 text-sm mt-2">Try another search term</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <SearchIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">Enter a stock symbol or company name to search</p>
              <p className="text-gray-500 text-sm mt-2">For example: AAPL, MSFT, Google, Amazon</p>
            </div>
          )}
        </div>
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

export default Search;
