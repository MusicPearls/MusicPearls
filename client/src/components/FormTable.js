import React, { useState, useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom';
import OpusTable from './OpusTable';
import './FormTable.css'

function FormTable() {
    const [backData, setBackData] = useState({ Forms: [] });
    const [searchTerm, setSearchTerm] = useState('');
    
    const apiUrl = process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_API_BASE_URL
      : process.env.REACT_APP_LOCAL_API_BASE_URL;

    useEffect(() => {
      fetch(`${apiUrl}/forms`)
        .then(response => response.json())
        .then(data => { setBackData(data) })
        .catch(error => console.error('Error fetching forms:', error));
    }, [apiUrl]);

    const FORM_CATEGORIES = {
      "Orchestral Works": { color: '#A99985' },
      "Concertos": { color: '#A99985' },
      "Chamber Music": { color: '#A99985' },
      "Sonatas": { color: '#A99985' },
      "Sacred & Vocal": { color: '#A99985' },
      "Piano Character Pieces": { color: '#A99985' },
      "Dance Forms": { color: '#A99985' },
      "Other Forms": { color: '#A99985' }
    };

    if (!backData || !backData.Forms) {
      return <p>Loading musical forms...</p>;
    }

    // Group forms by their category, maintaining server's popularity order
    const groupedForms = backData.Forms.reduce((acc, form) => {
      if (form.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        const category = form.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(form);
      }
      return acc;
    }, {});

    return (
      <div className='forms-container'>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search musical forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {Object.entries(FORM_CATEGORIES).map(([category, { color }]) => {
          if (!groupedForms[category] || groupedForms[category].length === 0) return null;

          return (
            <div key={category} className="category-section">
              <h2 className="category-header" style={{ backgroundColor: color }}>
                <div>{category}</div>
              </h2>
              <div className="forms-grid">
                {groupedForms[category].map((form, i) => (
                  <Link 
                    to={`/form/${encodeURIComponent(form.name)}`}
                    key={i}
                    className="form-card"
                    style={{ borderColor: color }}
                  >
                    <div className="form-info">
                      <h3>{form.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        <Routes>
          <Route path={'/form/:formname'} element={<OpusTable/>} />
        </Routes>
      </div>
    )
}

export default FormTable