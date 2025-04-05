// components/PredictionChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

function PredictionChart({ historicalData, predictionData }) {
  // Prepare combined data for chart
  const latestDate = new Date(historicalData[historicalData.length - 1].date);
  //  historicalData = [
  //   { date: '2024-03-01', close: 150.23 },
  //   { date: '2024-03-02', close: 152.45 }
  //   ];
  
  //  predictionData = [
  //   { date: '2024-03-15', price: 158.34 },
  //   { date: '2024-03-16', price: 160.02 }
  // ];
  console.log('Historical:', historicalData);
  console.log('Prediction:', predictionData);

  
  
  const chartData = [
    ...historicalData.map(item => ({
      date: item.date,
      actual: item.close,
      predicted: null
    })),
    ...predictionData.map(item => ({
      date: item.date,
      actual: null,
      predicted: item.price
    }))
  ];

  return (
    <div>
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
              interval={Math.ceil(chartData.length / 7) - 1}
            />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <ReferenceLine x={historicalData[historicalData.length - 1].date} stroke="#888" strokeDasharray="3 3" label="Today" />
            <Line type="monotone" dataKey="actual" stroke="#2563eb" name="Actual" dot={false} />
            <Line type="monotone" dataKey="predicted" stroke="#10b981" name="Predicted" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4">
        <div className="flex items-center text-sm">
          <div className="w-4 h-4 bg-blue-600 mr-2"></div>
          <span>Historical Data</span>
        </div>
        <div className="flex items-center text-sm mt-1">
          <div className="w-4 h-4 bg-green-600 mr-2"></div>
          <span>Predicted Price</span>
        </div>
      </div>
    </div>
  );
}

export default PredictionChart;