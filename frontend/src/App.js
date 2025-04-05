// App.js
import React, { useState, useRef } from "react";
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import StockDashboard from './components/StockDashboard';
import TrendingStocks from './components/TrendingStocks';
import StockDetail from './components/StockDetail';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [currentTicker, setCurrentTicker] = useState('');
  const inputRef = useRef(null); 

  const handleSearchSubmit = (ticker) => {
    setCurrentTicker(ticker.toUpperCase());
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="app">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <SearchBar onSubmit={handleSearchSubmit} inputRef={inputRef} />
        
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <TrendingStocks onSelectStock={setCurrentTicker} />
                {currentTicker && <StockDashboard ticker={currentTicker} />}
              </>
            } 
          />
          <Route path="/stock/:ticker" element={<StockDetail />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;