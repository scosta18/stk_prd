// components/StockInfo.jsx
import React from 'react';

function StockInfo({ data, info }) {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-2xl font-bold">{info.name} ({data.ticker})</h3>
        <div className="flex items-center mt-2">
          <span className="text-xl font-semibold">${data.price}</span>
          <span className={`ml-2 px-2 py-1 rounded text-sm ${data.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {data.change >= 0 ? '+' : ''}{data.change} ({data.change_percent}%)
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Sector</p>
          <p className="font-medium">{info.sector || 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600">Industry</p>
          <p className="font-medium">{info.industry || 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600">Market Cap</p>
          <p className="font-medium">{info.marketCap ? `$${(info.marketCap / 1000000000).toFixed(2)}B` : 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600">P/E Ratio</p>
          <p className="font-medium">{info.pe_ratio ? info.pe_ratio.toFixed(2) : 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600">52-Week High</p>
          <p className="font-medium">${info["52week_high"] ? info["52week_high"].toFixed(2) : 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-600">52-Week Low</p>
          <p className="font-medium">${info["52week_low"] ? info["52week_low"].toFixed(2) : 'N/A'}</p>
        </div>
      </div>
      
      {info.description && (
        <div className="mt-4">
          <p className="text-gray-600 mb-1">About</p>
          <p className="text-sm">{info.description.length > 200 ? `${info.description.substring(0, 200)}...` : info.description}</p>
        </div>
      )}
    </div>
  );
}

export default StockInfo;
