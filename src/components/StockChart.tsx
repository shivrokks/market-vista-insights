
import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { AxisDomain } from "recharts/types/util/types";

interface StockChartProps {
  data: any[];
  symbol: string;
  name: string;
  isPositive?: boolean;
}

const StockChart: React.FC<StockChartProps> = ({
  data,
  symbol,
  name,
  isPositive = true,
}) => {
  const [timeframe, setTimeframe] = useState<"1W" | "1M" | "3M" | "1Y" | "ALL">("1M");
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Filter data based on selected timeframe
  useEffect(() => {
    if (!data || data.length === 0) return;
    
    const now = new Date();
    let filteredData;
    
    switch (timeframe) {
      case "1W":
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        filteredData = data.filter(item => new Date(item.date) >= oneWeekAgo);
        break;
      case "1M":
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        filteredData = data.filter(item => new Date(item.date) >= oneMonthAgo);
        break;
      case "3M":
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        filteredData = data.filter(item => new Date(item.date) >= threeMonthsAgo);
        break;
      case "1Y":
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        filteredData = data.filter(item => new Date(item.date) >= oneYearAgo);
        break;
      case "ALL":
      default:
        filteredData = [...data];
        break;
    }
    
    setChartData(filteredData);
  }, [timeframe, data]);

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-medium">{format(new Date(label), "MMM d, yyyy")}</p>
          <p className="text-primary font-medium">${payload[0].value?.toFixed(2)}</p>
          <p className="text-gray-500 text-sm">
            Volume: {payload[0].payload.volume?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate domain to create some padding
  const calculateYAxisDomain = (): AxisDomain => {
    if (!chartData || chartData.length === 0) return [0, 0];
    
    const prices = chartData.map(item => item.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    const padding = (max - min) * 0.1; // 10% padding
    return [min - padding, max + padding];
  };

  // Time frame buttons
  const timeframeButtons = [
    { label: "1W", value: "1W" },
    { label: "1M", value: "1M" },
    { label: "3M", value: "3M" },
    { label: "1Y", value: "1Y" },
    { label: "ALL", value: "ALL" },
  ] as const;

  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle>
            {symbol} <span className="text-gray-500 font-normal text-sm ml-2">{name}</span>
          </CardTitle>
          <div className="flex space-x-1">
            {timeframeButtons.map((btn) => (
              <Button
                key={btn.value}
                variant={timeframe === btn.value ? "default" : "outline"}
                size="sm"
                className="text-xs py-1 h-8"
                onClick={() => setTimeframe(btn.value)}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={isPositive ? "#16a34a" : "#dc2626"}
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor={isPositive ? "#16a34a" : "#dc2626"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), "MMM d")}
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  domain={calculateYAxisDomain()}
                  tickFormatter={(value) => `$${value}`}
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? "#16a34a" : "#dc2626"}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No chart data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;
