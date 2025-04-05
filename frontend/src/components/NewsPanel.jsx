// components/NewsPanel.jsx
import React from 'react';

function NewsPanel({ news }) {
  if (!news || news.length === 0) {
    return <p>No recent news available</p>;
  }

  return (
    <div className="space-y-4">
      {news.map((item, index) => (
        <div key={index} className="border-b pb-3">
          <p className="font-medium">{item.headline}</p>
          <p className="text-sm text-gray-500">{item.source}</p>
        </div>
      ))}
    </div>
  );
}

export default NewsPanel;