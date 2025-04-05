// components/Footer.jsx
import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Stock Predictor</h2>
            <p className="text-gray-400 text-sm">
              A stock analysis and prediction application
            </p>
          </div>
          
          <div className="text-center mb-4 md:mb-0 md:text-right">
            <p className="text-sm text-gray-400">
              This application is for educational purposes only.
              <br />
              Not financial advice. Invest at your own risk.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Stock Predictor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;