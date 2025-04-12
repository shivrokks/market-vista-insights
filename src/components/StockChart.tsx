import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const companyList = [
  { symbol: "AIRTEL", name: "Bharti Airtel Ltd." },
  { symbol: "IDEA", name: "Vodafone Idea Ltd." },
  { symbol: "TATA COMM", name: "Tata Communications Ltd." },
  { symbol: "TEJAS NET", name: "Tejas Networks Ltd." },
  { symbol: "CENTUM", name: "Centum Electronics Ltd." },
  { symbol: "CYIENT", name: "Cyient Ltd." },
  { symbol: "PGEL", name: "PG Electroplast Ltd." },
  { symbol: "PULZ", name: "Pulses Inc." },
  { symbol: "BPL", name: "BPL Ltd." },
  { symbol: "BAJFIN", name: "Bajaj Finance Ltd." },
  { symbol: "CSLFIN", name: "CSL Finance Ltd." },
  { symbol: "TCIFIN", name: "TCI Finance Ltd." },
  { symbol: "VLSFIN", name: "VLS Finance Ltd." },
  { symbol: "HCLTECH", name: "HCL Technologies Ltd." },
  { symbol: "INFY", name: "Infosys Ltd." },
  { symbol: "RELI", name: "Reliance Industries Ltd." },
  { symbol: "TCS", name: "Tata Consultancy Services Ltd." },
  { symbol: "WIPRO", name: "Wipro Ltd." },
  { symbol: "BPCL", name: "Bharat Petroleum Corp. Ltd." },
  { symbol: "CASTROL", name: "Castrol India Ltd." },
  { symbol: "DEEPINDS", name: "Deep Industries Ltd." },
  { symbol: "GAIL", name: "GAIL (India) Ltd." },
  { symbol: "JINDIL", name: "Jindal Drilling & Industries Ltd." },
  { symbol: "ADANIGREEN", name: "Adani Green Energy Ltd." },
  { symbol: "JSWENE", name: "JSW Energy Ltd." },
  { symbol: "KPIGR", name: "KPI Green Energy Ltd." }
];

// Mock function to simulate past 15 days of prices around a base price
const generateMockData = (basePrice: number) => {
  const data = [];
  for (let i = 14; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const priceFluctuation = (Math.random() - 0.5) * 10;
    data.push({
      date: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }),
      price: parseFloat((basePrice + priceFluctuation).toFixed(2)),
    });
  }
  return data;
};

// Static price info for each company
const companyPriceMap: Record<string, number> = {
  "AIRTEL": 1715.55,
  "IDEA": 12.34,
  "TATA COMM": 1050.5,
  "TEJAS NET": 350.75,
  "CENTUM": 450.25,
  "CYIENT": 550,
  "PGEL": 150.5,
  "PULZ": 76.01,
  "BPL": 200,
  "BAJFIN": 8000,
  "CSLFIN": 300,
  "TCIFIN": 250,
  "VLSFIN": 100,
  "HCLTECH": 1000,
  "INFY": 1500,
  "RELI": 2000,
  "TCS": 3000,
  "WIPRO": 400,
  "BPCL": 500,
  "CASTROL": 150,
  "DEEPINDS": 200,
  "GAIL": 300,
  "JINDIL": 350,
  "ADANIGREEN": 400,
  "JSWENE": 450,
  "KPIGR": 500,
};

const StockGraph: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("PULZ");

  const selectedPrice = companyPriceMap[selectedSymbol];
  const stockData = generateMockData(selectedPrice);

  const chartData = {
    labels: stockData.map(item => item.date),
    datasets: [
      {
        label: `${selectedSymbol} Stock Price`,
        data: stockData.map(item => item.price),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="p-2 border rounded"
        >
          {companyList.map((company) => (
            <option key={company.symbol} value={company.symbol}>
              {company.name}
            </option>
          ))}
        </select>
      </div>
      <Line data={chartData} />
    </div>
  );
};

export default StockGraph;
