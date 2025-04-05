// components/TechnicalIndicators.jsx
import React from 'react';

function TechnicalIndicators({ data }) {
  if (!data || !data.indicators) {
    return <div>No indicator data available</div>;
  }

  const { indicators } = data;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 border rounded-md">
          <div className="text-sm text-gray-600">RSI (14)</div>
          <div className="text-lg font-semibold">
            {indicators.rsi ? indicators.rsi.toFixed(2) : 'N/A'}
          </div>
          <div className="text-xs text-gray-500">
            {indicators.rsi < 30 ? 'Oversold' : indicators.rsi > 70 ? 'Overbought' : 'Neutral'}
          </div>
        </div>
        
        <div className="p-3 border rounded-md">
          <div className="text-sm text-gray-600">MACD</div>
          <div className="text-lg font-semibold">
            {indicators.macd ? indicators.macd.toFixed(2) : 'N/A'}
          </div>
          <div className="text-xs text-gray-500">
            Signal: {indicators.signal ? indicators.signal.toFixed(2) : 'N/A'}
          </div>
        </div>
      </div>
      
      <div className="p-3 border rounded-md">
        <div className="text-sm text-gray-600">Moving Averages</div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div>
            <div className="text-xs text-gray-500">MA20</div>
            <div className="font-semibold">${indicators.ma20?.toFixed(2) || 'N/A'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">MA50</div>
            <div className="font-semibold">${indicators.ma50?.toFixed(2) || 'N/A'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">MA200</div>
            <div className="font-semibold">${indicators.ma200?.toFixed(2) || 'N/A'}</div>
          </div>
        </div>
        
        <div className="mt-3 text-sm">
          {indicators.price && indicators.ma200 && (
            <>
              {indicators.price > indicators.ma200 ? (
                <span className="text-green-600">Price is above 200-day MA (Bullish)</span>
              ) : (
                <span className="text-red-600">Price is below 200-day MA (Bearish)</span>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="p-3 border rounded-md">
        <div className="text-sm text-gray-600">Summary</div>
        <div className="mt-1">
          {indicators.rsi && indicators.macd && indicators.signal && indicators.ma20 && indicators.ma50 && (
            <div className="text-sm">
              {(() => {
                let bullishSignals = 0;
                let bearishSignals = 0;
                
                // RSI
                if (indicators.rsi < 30) bullishSignals++;
                else if (indicators.rsi > 70) bearishSignals++;
                
                // MACD
                if (indicators.macd > indicators.signal) bullishSignals++;
                else if (indicators.macd < indicators.signal) bearishSignals++;
                
                // Moving Averages
                if (indicators.ma20 > indicators.ma50) bullishSignals++;
                else if (indicators.ma20 < indicators.ma50) bearishSignals++;
                
                if (bullishSignals > bearishSignals) {
                  return <span className="text-green-600 font-medium">Bullish: {bullishSignals} bullish signals vs {bearishSignals} bearish signals</span>;
                } else if (bearishSignals > bullishSignals) {
                  return <span className="text-red-600 font-medium">Bearish: {bearishSignals} bearish signals vs {bullishSignals} bullish signals</span>;
                } else {
                  return <span className="text-yellow-600 font-medium">Neutral: Equal bullish and bearish signals</span>;
                }
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TechnicalIndicators;