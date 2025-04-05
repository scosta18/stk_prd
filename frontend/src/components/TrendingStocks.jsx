// components/TrendingStocks.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

const API_BASE_URL = 'http://localhost:8000/api';

function TrendingStocks({ onSelectStock }) {
  const [trendingStocks, setTrendingStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingStocks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/stocks/trending`);
        setTrendingStocks(response.data.trending);
        setLoading(false);
      } catch (err) {
        setError('Failed to load trending stocks');
        setLoading(false);
      }
    };

    fetchTrendingStocks();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Trending Stocks</h2>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Trending Stocks</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Trending Stocks</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Symbol</th>
              <th className="px-4 py-2 text-left">Company</th>
              <th className="px-4 py-2 text-right">Price</th>
              <th className="px-4 py-2 text-right">Change</th>
            </tr>
          </thead>
          <tbody>
            {trendingStocks.map((stock) => (
              <tr key={stock.ticker} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">
                  <Link 
                    to={`/stock/${stock.ticker}`} 
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => onSelectStock(stock.ticker)}
                  >
                    {stock.ticker}
                  </Link>
                </td>
                <td className="px-4 py-2">{stock.name}</td>
                <td className="px-4 py-2 text-right">${stock.price}</td>
                <td className={`px-4 py-2 text-right ${stock.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.change_percent > 0 ? '+' : ''}{stock.change_percent}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TrendingStocks;