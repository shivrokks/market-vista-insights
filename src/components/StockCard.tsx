
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Stock } from "@/services/api";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StockCardProps {
  stock: Stock;
  onAddToWatchlist?: (symbol: string) => void;
  showAddButton?: boolean;
  className?: string;
}

const StockCard: React.FC<StockCardProps> = ({
  stock,
  onAddToWatchlist,
  showAddButton = false,
  className = "",
}) => {
  const {
    symbol,
    name,
    price,
    change,
    changePercent,
  } = stock;

  const isPositive = change >= 0;
  const changeClass = isPositive ? "text-green-600" : "text-red-600";
  const formattedChange = change.toFixed(2);
  const formattedChangePercent = Math.abs(changePercent).toFixed(2);

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <Link to={`/stock/${symbol}`} className="block">
            <h3 className="font-bold text-lg">{symbol}</h3>
            <p className="text-sm text-gray-500 truncate" title={name}>
              {name}
            </p>
          </Link>
          
          <div className="text-right">
            <p className="font-medium text-lg">${price.toFixed(2)}</p>
            <div className={`flex items-center justify-end ${changeClass}`}>
              {isPositive ? (
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 mr-1" />
              )}
              <span className="text-sm">
                {isPositive ? "+" : ""}{formattedChange} ({formattedChangePercent}%)
              </span>
            </div>
          </div>
        </div>
        
        {showAddButton && onAddToWatchlist && (
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => onAddToWatchlist(symbol)}
            >
              Add to Watchlist
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockCard;
