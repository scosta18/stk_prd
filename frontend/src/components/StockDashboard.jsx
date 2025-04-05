// components/StockDashboard.jsx
import React, { useState, useEffect } from 'react';
import StockChart from './StockChart';
import StockInfo from './StockInfo';
import PredictionChart from './PredictionChart';
import NewsPanel from './NewsPanel';
import LoadingSpinner from './LoadingSpinner';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

function StockDashboard({ ticker }) {
  const [stockData, setStockData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchAllData = async () => {
      try {
        // Fetch data in parallel
        const [
          stockResponse,
          historyResponse,
          predictionResponse,
          newsResponse,
          infoResponse
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/stock/${ticker}`),
          axios.get(`${API_BASE_URL}/stock/${ticker}/history?period=6mo`),
          axios.get(`${API_BASE_URL}/stock/${ticker}/predict/linear`),
          axios.get(`${API_BASE_URL}/stock/${ticker}/news`),
          axios.get(`${API_BASE_URL}/stock/${ticker}/info`)
        ]);

        setStockData(stockResponse.data);
        setHistoryData(historyResponse.data);
        setPredictionData(predictionResponse.data);
        setNewsData(newsResponse.data);
        setCompanyInfo(infoResponse.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (ticker) {
      fetchAllData();
    }
  }, [ticker]);

  if (!ticker) {
    return <div className="text-center mt-8">Enter a stock ticker to get started</div>;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Stock Price History</h2>
        {historyData && <StockChart data={historyData.history} />}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Company Info</h2>
        {companyInfo && <StockInfo data={stockData} info={companyInfo.info} />}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Price Prediction</h2>
        {predictionData && (
          <PredictionChart 
            historicalData={historyData.history.slice(-30)} 
            predictionData={predictionData.predictions} 
          />
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Recent News</h2>
        {newsData && <NewsPanel news={newsData.news} />}
      </div>
    </div>
  );
}

export default StockDashboard;