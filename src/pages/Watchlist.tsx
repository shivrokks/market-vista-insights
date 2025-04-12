import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import StockCard from "@/components/StockCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { getMockData, watchlistAPI, Stock } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  ListFilter,
  Star,
  Plus,
  Search,
  SortDesc,
  SortAsc,
  Trash2,
  ChevronDown,
} from "lucide-react";

const Watchlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [watchlistData, setWatchlistData] = useState<Stock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<{
    key: keyof Stock;
    order: "asc" | "desc";
  }>({ key: "symbol", order: "asc" });

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user) return setIsLoading(false);

      try {
        setIsLoading(true);
        const data = getMockData.watchlist(); // Replace with await watchlistAPI.getWatchlist() in real app
        setWatchlistData(data.stocks);
        setFilteredStocks(data.stocks);
      } catch (error) {
        console.error("Failed to fetch watchlist:", error);
        toast({
          title: "Error",
          description: "Failed to load your watchlist",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlist();
  }, [user, toast]);

  const sortStocks = (stocks: Stock[], key: keyof Stock, order: "asc" | "desc") => {
    return [...stocks].sort((a, b) => {
      if (a[key] < b[key]) return order === "asc" ? -1 : 1;
      if (a[key] > b[key]) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = watchlistData.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredStocks(query ? filtered : watchlistData);
  };

  const handleSort = (key: keyof Stock) => {
    const newOrder = sortOption.key === key && sortOption.order === "asc" ? "desc" : "asc";
    const sorted = sortStocks(filteredStocks, key, newOrder);

    setSortOption({ key, order: newOrder });
    setFilteredStocks(sorted);
  };

  const handleRemoveFromWatchlist = async (symbol: string) => {
    try {
      const updated = watchlistData.filter((stock) => stock.symbol !== symbol);
      setWatchlistData(updated);
      setFilteredStocks(updated);

      toast({
        title: "Removed from watchlist",
        description: `${symbol} has been removed from your watchlist`,
      });
    } catch (error) {
      console.error("Failed to remove from watchlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove stock from watchlist",
        variant: "destructive",
      });
    }
  };

  const sortFields: { label: string; key: keyof Stock }[] = [
    { label: "Symbol", key: "symbol" },
    { label: "Name", key: "name" },
    { label: "Price", key: "price" },
    { label: "% Change", key: "changePercent" },
  ];

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto py-8 px-4 flex flex-col items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Watchlist</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Star className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 mb-6">Please sign in to view and manage your watchlist</p>
              <div className="flex space-x-4 justify-center">
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Sign In
                </Button>
                <Button onClick={() => navigate("/register")}>Create Account</Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <footer className="bg-gray-50 border-t border-gray-200 py-8">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Market Vista Insights. All rights reserved.
          </div>
        </footer>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-6">Your Watchlist</h1>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Your Watchlist</h1>
          <Button className="mt-4 md:mt-0" onClick={() => navigate("/search")}>
            <Plus className="h-4 w-4 mr-2" /> Add Stocks
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search your watchlist..."
              className="pl-9 pr-4"
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search stocks"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <ListFilter className="h-4 w-4 mr-2" />
                Sort
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {sortFields.map(({ label, key }) => (
                <DropdownMenuItem key={key} onClick={() => handleSort(key)}>
                  <div className="flex items-center w-full">
                    {label}
                    {sortOption.key === key &&
                      (sortOption.order === "asc" ? (
                        <SortAsc className="h-4 w-4 ml-auto" />
                      ) : (
                        <SortDesc className="h-4 w-4 ml-auto" />
                      ))}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Watchlist Items */}
        {filteredStocks.length > 0 ? (
          <div className="space-y-4">
            {filteredStocks.map((stock) => (
              <Card key={stock.symbol} className="relative overflow-visible">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="flex-1">
                      <StockCard stock={stock} />
                    </div>
                    <div className="p-4 flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-600"
                        onClick={() => handleRemoveFromWatchlist(stock.symbol)}
                        aria-label={`Remove ${stock.symbol} from watchlist`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Star className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-6">
              {searchQuery ? "No matching stocks found in your watchlist" : "Your watchlist is empty"}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate("/search")}>
                <Plus className="h-4 w-4 mr-2" /> Add Stocks
              </Button>
            )}
          </div>
        )}
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Market Vista Insights. All rights reserved.</p>
          <p className="mt-2">Market data provided for informational purposes only. Not financial advice.</p>
        </div>
      </footer>
    </div>
  );
};

export default Watchlist;
