import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown, Circle } from "lucide-react";
import { format } from "date-fns";

import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { stocksAPI, getMockData, Stock } from "@/services/api";
import StockCard from "@/components/StockCard";

const Market: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['marketOverview'],
    queryFn: () => {
      // Use mock data for development
      return getMockData.marketOverview();
    },
  });

  // Mock data for market volume chart
  const volumeData = [
    { name: '9:30', volume: 1200000 },
    { name: '10:30', volume: 2000000 },
    { name: '11:30', volume: 1800000 },
    { name: '12:30', volume: 1500000 },
    { name: '13:30', volume: 1700000 },
    { name: '14:30', volume: 2200000 },
    { name: '15:30', volume: 2500000 },
    { name: '16:00', volume: 3000000 },
  ];

  // Mock data for sector performance
  const sectorData = [
    { name: 'IT Industry', performance: 2.4 },
    { name: 'Telecommunications', performance: 1.3 },
    { name: 'Finance', performance: -0.8 },
    { name: 'Renewable Energy', performance: -1.2 },
    { name: 'Oil Stocks', performance: 0.5 },
    { name: 'Auto Motive', performance: 0.2 },
    { name: 'Electronics', performance: -0.2 },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Market Overview</h1>
          <Card>
            <CardContent className="p-6">
              <div className="text-center p-8">
                <p className="text-destructive text-lg">Error loading market data</p>
                <p className="text-muted-foreground">Please try again later</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Market Overview</h1>
        
        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sectors">Sectors</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-6 w-40 mb-2" />
                      <Skeleton className="h-4 w-16" />
                    </CardContent>
                  </Card>
                ))
              ) : data?.indices?.map((index: Stock) => (
                <Card key={index.symbol}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {index.symbol === 'SPY' ? 'S&P 500' :
                        index.symbol === 'QQQ' ? 'NASDAQ' :
                        index.symbol === 'DIA' ? 'Dow Jones' : index.symbol}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-between">
                      <div className="text-2xl font-bold">{index.price.toFixed(2)}</div>
                      <div className={`flex items-center ${index.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {index.change >= 0 ? <ArrowUpCircle className="h-4 w-4 mr-1" /> : <ArrowDownCircle className="h-4 w-4 mr-1" />}
                        <span>{index.changePercent.toFixed(2)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-600 mr-2" /> Top Gainers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="mb-4">
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ))
                  ) : data?.topGainers?.map((stock: Stock) => (
                    <StockCard key={stock.symbol} stock={stock} />
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingDown className="h-5 w-5 text-red-600 mr-2" /> Top Losers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="mb-4">
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ))
                  ) : data?.topLosers?.map((stock: Stock) => (
                    <StockCard key={stock.symbol} stock={stock} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sectors">
            <Card>
              <CardHeader>
                <CardTitle>Sector Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sectorData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Performance']}
                    />
                    <Legend />
                    <Bar 
                      dataKey="performance" 
                      fill="#4f46e5"
                      name="Performance %" 
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Sector Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Technology leads today's market with strong gains, while Energy and Finance sectors show weakness. 
                    Healthcare continues its positive trend from last week.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="volume">
            <Card>
              <CardHeader>
                <CardTitle>Market Volume (Today)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={volumeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${(value / 1000000).toFixed(1)}M`, 'Volume']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="volume" 
                      name="Trading Volume" 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Volume Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Trading volume peaked at market close with 3M shares traded. Volume has been 
                    higher than the 10-day average, indicating increased market activity.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Market News</h2>
          <div className="space-y-4">
            {/* Mock news items */}
            {[1, 2, 3].map((item) => (
              <Card key={item}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium mb-1">
                        {item === 1 ? 'Fed signals potential rate cut in upcoming meeting' :
                         item === 2 ? 'Tech stocks rally on positive earnings reports' :
                         'Oil prices stabilize after recent volatility'}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item === 1 ? 'The Federal Reserve has indicated it may consider cutting interest rates at its next meeting in response to decreasing inflation pressures and concerns about economic growth.' :
                         item === 2 ? 'Major technology companies exceeded analyst expectations in their quarterly reports, leading to a broad rally in tech stocks and pushing the Nasdaq to new highs.' : 
                         'After weeks of price swings, oil markets have settled as supply concerns ease and demand forecasts stabilize.'}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(), 'MMM d')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;
