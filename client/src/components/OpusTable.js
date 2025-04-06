import React, {useEffect, useState} from 'react'
import { useLocation, Link } from 'react-router-dom';
import OpusBox from './OpusBox';
import './OpusTable.css'

function OpusTable() {
    const [description, setDescription] = useState('');
    const [wikiUrl, setWikiUrl] = useState('');
    const [topForms, setTopForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState('');  // New state for form filter
    const [allOpus, setAllOpus] = useState([]);  // Store all opus
    const apiUrl = process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_API_BASE_URL
        : process.env.REACT_APP_LOCAL_API_BASE_URL;

    const location = useLocation();
    const decodedPath = decodeURIComponent(location.pathname || '');
    const pathParts = decodedPath.split('/')
    const composerName = pathParts[pathParts.length - 1]
  
    useEffect(() => {
        fetch(`${apiUrl}/opus?composer=${composerName}`).then(
            response => response.json()).then(
            data => {
                setTopForms(data.TopForms || []);
                setAllOpus(data.Opus || []); // Store all opus
            }
        )

        fetch(`${apiUrl}/wiki/composer?composer=${composerName}`)
            .then(response => response.json())
            .then(data => { 
                setDescription(data.summary);
                setWikiUrl(data.url);
            });
    }, [composerName, apiUrl])

    // Get unique forms from opus for the dropdown
    const uniqueForms = [...new Set(allOpus.map(opus => opus.form))].sort();

    // Filter opus based on selected form
    const filteredOpus = selectedForm 
        ? allOpus.filter(opus => opus.form === selectedForm)
        : allOpus;
        
    return (
        <div>
            <div className='description'>
                <h3>{composerName}</h3>
                <p>{description}</p>
                {wikiUrl && (
                    <p className="wiki-link">
                        <a href={wikiUrl} target="_blank" rel="noopener noreferrer">
                            See more →
                        </a>
                    </p>
                )}
                
                {topForms.length > 0 && (
                    <div className="top-forms">
                        <h3>Most Popular Forms</h3>
                        <div className="forms-list">
                            {topForms.map((form, index) => (
                                <div key={form} className="top-form-item">
                                    <span className="form-rank">{index + 1}</span>
                                    <Link 
                                        to={`/form/${encodeURIComponent(form)}`}
                                        className="form-name"
                                    >
                                        {form}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add form filter dropdown */}
                <div className="form-filter">
                
                    <select 
                        value={selectedForm}
                        onChange={(e) => setSelectedForm(e.target.value)}
                        className="form-select"
                    >
                        <option value="" disabled>Filter by musical form...</option>
                        <option value="">All Forms</option>
                        {uniqueForms.map(form => (
                            <option key={form} value={form}>{form}</option>
                        ))}
                    </select>
                </div>
            </div>

            {(typeof filteredOpus === 'undefined') ? (
                <p>No Opus found for this composer</p>
            ) : (
                (filteredOpus.length === 0) ? (
                    <p>No work found for this composer on registered musical forms</p>
                ) : (
                    filteredOpus.map((opus, i) => (
                        <OpusBox key={i} opus={opus} index={i}/>
                    ))
                )
            )}
        </div>
    )
}

export default OpusTable