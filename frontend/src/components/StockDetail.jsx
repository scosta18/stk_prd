// components/StockDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import StockChart from './StockChart';
import StockInfo from './StockInfo';
import PredictionChart from './PredictionChart';
import NewsPanel from './NewsPanel';
import TechnicalIndicators from './TechnicalIndicators';
import PredictionToggle from './PredictionToggle';
import LoadingSpinner from './LoadingSpinner';

const API_BASE_URL = 'http://localhost:8000/api';

function StockDetail() {
  const { ticker } = useParams();
  const [stockData, setStockData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [predictionType, setPredictionType] = useState('linear');
  const [newsData, setNewsData] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [historyPeriod, setHistoryPeriod] = useState('6mo');
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
          indicatorsResponse,
          predictionResponse,
          newsResponse,
          infoResponse
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/stock/${ticker}`),
          axios.get(`${API_BASE_URL}/stock/${ticker}/history?period=${historyPeriod}`),
          axios.get(`${API_BASE_URL}/stock/${ticker}/indicators`),
          axios.get(`${API_BASE_URL}/stock/${ticker}/predict/${predictionType}`),
          axios.get(`${API_BASE_URL}/stock/${ticker}/news`),
          axios.get(`${API_BASE_URL}/stock/${ticker}/info`)
        ]);

        setStockData(stockResponse.data);
        setHistoryData(historyResponse.data);
        setIndicators(indicatorsResponse.data);
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
  }, [ticker, historyPeriod, predictionType]);

  const handlePeriodChange = (period) => {
    setHistoryPeriod(period);
  };

  const handlePredictionTypeChange = (type) => {
    setPredictionType(type);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Loading {ticker} Data</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {stockData && companyInfo && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <StockInfo data={stockData} info={companyInfo.info} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Stock Price History</h2>
            <div className="flex space-x-2">
              {['1mo', '3mo', '6mo', '1y', '5y'].map((period) => (
                <button
                  key={period}
                  onClick={() => handlePeriodChange(period)}
                  className={`px-2 py-1 text-xs rounded ${
                    historyPeriod === period 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          {historyData && <StockChart data={historyData.history} />}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Price Prediction</h2>
            <PredictionToggle 
              active={predictionType} 
              onChange={handlePredictionTypeChange} 
            />
          </div>
          {predictionData && historyData && (
            <PredictionChart 
              historicalData={historyData.history.slice(-30)} 
              predictionData={predictionData.predictions} 
            />
          )}
          {predictionData && predictionData.confidence && (
            <div className="mt-2 text-sm text-gray-600">
              Model confidence: {predictionData.confidence}%
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Technical Indicators</h2>
          {indicators && <TechnicalIndicators data={indicators} />}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent News</h2>
          {newsData && <NewsPanel news={newsData.news} />}
        </div>
      </div>
    </div>
  );
}

export default StockDetail;