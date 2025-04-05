//components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Stock Predictor</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          <a href="https://github.com/yourusername/stock-predictor" 
             target="_blank" 
             rel="noopener noreferrer"
             className="hover:text-blue-200">
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;