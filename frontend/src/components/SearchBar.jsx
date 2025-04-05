// components/SearchBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar({ onSubmit, inputRef }) {
  const [ticker, setTicker] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ticker.trim()) {
      onSubmit(ticker);
      navigate(`/stock/${ticker.toUpperCase()}`);
    }
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Enter stock ticker (e.g., AAPL)"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ref={inputRef}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;