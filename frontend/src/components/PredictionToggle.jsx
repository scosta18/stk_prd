// components/PredictionToggle.jsx
import React from 'react';

function PredictionToggle({ active, onChange }) {
  return (
    <div className="flex space-x-1 bg-gray-200 rounded-md p-1">
      <button
        onClick={() => onChange('linear')}
        className={`px-3 py-1 text-xs rounded ${
          active === 'linear' 
            ? 'bg-blue-600 text-white' 
            : 'hover:bg-gray-300'
        }`}
      >
        Linear
      </button>
      <button
        onClick={() => onChange('lstm')}
        className={`px-3 py-1 text-xs rounded ${
          active === 'lstm' 
            ? 'bg-blue-600 text-white' 
            : 'hover:bg-gray-300'
        }`}
      >
        LSTM
      </button>
    </div>
  );
}

export default PredictionToggle;