// components/StockChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function StockChart({ data }) {
  // Prepare data for chart
  const chartData = data.map(item => ({
    date: item.date,
    close: item.close
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            interval={Math.ceil(chartData.length / 10) - 1}
          />
          <YAxis 
            domain={['auto', 'auto']}
            tick={{ fontSize: 12 }}
          />
          <Tooltip formatter={(value) => ['$' + value.toFixed(2), 'Price']} />
          <Line type="monotone" dataKey="close" stroke="#2563eb" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StockChart;