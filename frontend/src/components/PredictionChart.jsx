import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

function PredictionChart({ historicalData, predictionData }) {
  // Check if data exists and has length
  const hasHistoricalData = Array.isArray(historicalData) && historicalData.length > 0;
  const hasPredictionData = Array.isArray(predictionData) && predictionData.length > 0;

  // Only proceed if we have some data
  if (!hasHistoricalData) {
    return <p>Missing historical data</p>;
  }

  // Prepare combined data for chart with simplified dates
  const chartData = [];
  
  // Add historical data with simplified dates
  historicalData.forEach((item, index) => {
    if (item && item.date && typeof item.close !== 'undefined') {
      // Extract just the month and day for display simplicity
      let dateObj = new Date(item.date);
      let displayDate = `${dateObj.getMonth()+1}/${dateObj.getDate()}`;
      
      chartData.push({
        fullDate: item.date,
        date: displayDate, 
        actual: Number(item.close),
        predicted: null,
        // Add a sequential number for fallback
        index
      });
    }
  });
  
  // Add prediction data
  if (hasPredictionData) {
    predictionData.forEach((item, index) => {
      if (item && item.date && typeof item.price !== 'undefined') {
        let dateObj = new Date(item.date);
        let displayDate = `${dateObj.getMonth()+1}/${dateObj.getDate()}`;
        
        chartData.push({
          fullDate: item.date,
          date: displayDate,
          actual: null,
          predicted: Number(item.price),
          index: historicalData.length + index
        });
      }
    });
  }

  // Get latest historical date for reference line
  const latestHistoricalIndex = hasHistoricalData ? historicalData.length - 1 : null;

  return (
    <div>
      {/* Simple non-responsive chart that should always display */}
      <div className="overflow-x-auto pb-4">
        <div style={{ width: '100%', minWidth: '600px', height: '300px' }}>
          <LineChart
            width={600}
            height={300}
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 10 }}
              interval={Math.floor(chartData.length / 10)} 
              angle={-45}
              textAnchor="end"
            />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                `$${value.toFixed(2)}`, 
                name === 'actual' ? 'Historical' : 'Predicted'
              ]}
              labelFormatter={(label, items) => {
                const dataPoint = chartData.find(item => item.date === label);
                return dataPoint ? dataPoint.fullDate : label;
              }}
            />
            <Legend />
            {latestHistoricalIndex !== null && (
              <ReferenceLine
                x={chartData[latestHistoricalIndex].date}
                stroke="#888"
                strokeDasharray="3 3"
                label={{ value: "Today", position: "top", fontSize: 10 }}
              />
            )}
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#2563eb" 
              name="Historical" 
              dot={{ r: 2 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#10b981"
              name="Predicted"
              strokeDasharray="5 5"
              dot={{ r: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        </div>
      </div>

      {/* Legend visible in mobile view */}
      <div className="mt-4 md:hidden">
        <div className="flex items-center text-sm">
          <div className="w-4 h-4 bg-blue-600 mr-2"></div>
          <span>Historical Data ({chartData.filter(d => d.actual !== null).length} points)</span>
        </div>
        <div className="flex items-center text-sm mt-1">
          <div className="w-4 h-4 bg-green-600 mr-2"></div>
          <span>Predicted Price ({chartData.filter(d => d.predicted !== null).length} points)</span>
        </div>
      </div>
      
      {/* Show some example data in a table for debugging */}
      <div className="mt-4 text-xs">
        <h4 className="font-bold">Sample Data Points:</h4>
        <div className="overflow-x-auto">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="border p-1">Date</th>
                <th className="border p-1">Historical</th>
                <th className="border p-1">Predicted</th>
              </tr>
            </thead>
            <tbody>
              {/* First 3 historical points */}
              {chartData.slice(0, 3).map((item, i) => (
                <tr key={`hist-${i}`}>
                  <td className="border p-1">{item.fullDate}</td>
                  <td className="border p-1">{item.actual !== null ? `$${item.actual.toFixed(2)}` : '-'}</td>
                  <td className="border p-1">{item.predicted !== null ? `$${item.predicted.toFixed(2)}` : '-'}</td>
                </tr>
              ))}
              {/* Last historical + first 2 predictions */}
              {latestHistoricalIndex !== null && (
                <>
                  <tr key="hist-last">
                    <td className="border p-1">{chartData[latestHistoricalIndex].fullDate}</td>
                    <td className="border p-1">{`$${chartData[latestHistoricalIndex].actual.toFixed(2)}`}</td>
                    <td className="border p-1">-</td>
                  </tr>
                  {chartData.slice(latestHistoricalIndex + 1, latestHistoricalIndex + 3).map((item, i) => (
                    <tr key={`pred-${i}`}>
                      <td className="border p-1">{item.fullDate}</td>
                      <td className="border p-1">-</td>
                      <td className="border p-1">{item.predicted !== null ? `$${item.predicted.toFixed(2)}` : '-'}</td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PredictionChart;