import React, { useState, useEffect } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import OpusTable from './OpusTable';
import './ComposerTable.css';

const PERIODS = {
  'Medieval': { years: [500, 1400], color: '#A99985' },
  'Renaissance': { years: [1400, 1600], color: '#A99985' },
  'Baroque': { years: [1600, 1750], color: '#A99985' },
  'Classical': { years: [1750, 1820], color: '#A99985' },
  'Romantic': { years: [1820, 1900], color: '#A99985' },
  'Modern': { years: [1900, 1945], color: '#A99985' },
  'Contemporary': { years: [1945, 2024], color: '#A99985' }
};

const ComposerTable = () => {
  const [backData, setBackData] = useState([{}]);
  const [searchTerm, setSearchTerm] = useState('');

  const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_BASE_URL
    : process.env.REACT_APP_LOCAL_API_BASE_URL;

  useEffect(() => {
    fetch(`${apiUrl}/composers`)
      .then(response => response.json())
      .then(data => { setBackData(data) })
      .catch(error => console.error('Error fetching composers:', error));
  }, [apiUrl]);

  if (typeof backData.Composers === 'undefined') {
    return <p>Loading composer list...</p>;
  }

  // Group composers by their period property
  const groupedComposers = backData.Composers.reduce((acc, composer) => {
    if (composer.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      const period = composer.period || 'Unknown';
      if (!acc[period]) {
        acc[period] = [];
      }
      acc[period].push(composer);
    }
    return acc;
  }, {});

  return (
    <div className="composers-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search composers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {Object.entries(PERIODS).map(([period, { years, color }]) => {
        if (!groupedComposers[period] || groupedComposers[period].length === 0) return null;

        return (
          <div key={period} className="period-section">
            <h2 className="period-header" style={{ backgroundColor: color }}>
              <div>
                {period} <span className="period-years">({years[0]}–{years[1]})</span>
              </div>
            </h2>
            <div className="composers-grid">
              {groupedComposers[period]
                .sort((a, b) => a.birthyear - b.birthyear) // Sort composers by birth year within each period
                .map((composer, i) => (
                <Link 
                  to={`/composer/${encodeURIComponent(composer.name)}`}
                  key={i}
                  className="composer-card"
                  style={{ borderColor: color }}
                >
                  <div className="composer-info">
                    <h3>{composer.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      <Routes>
        <Route path={'/composer/:name'} element={<OpusTable/>} />
      </Routes>
    </div>
  );
};

export default ComposerTable;