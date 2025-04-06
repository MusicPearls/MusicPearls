import React, {useEffect, useState} from 'react'
import { useLocation, Link } from 'react-router-dom';
import OpusBox from './OpusBox';
import './FormRanking.css';

function FormRanking() {
    const [description, setDescription] = useState('');
    const [topComposers, setTopComposers] = useState([]);
    const [selectedComposer, setSelectedComposer] = useState('');
    const [allOpus, setAllOpus] = useState([]);
    const apiUrl = process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_API_BASE_URL
        : process.env.REACT_APP_LOCAL_API_BASE_URL;

    const location = useLocation();
    const decodedPath = decodeURIComponent(location.pathname || '');
    const pathParts = decodedPath.split('/')
    const formName = pathParts[pathParts.length - 1]
  
    useEffect(() => {
        fetch(`${apiUrl}/opus?form=${formName}`)
            .then(response => response.json())
            .then(data => {
                setTopComposers(data.TopComposers || []);
                setAllOpus(data.FormOpus || []);
            });

        fetch(`${apiUrl}/forms/description?form=${formName}`)
            .then(response => response.json())
            .then(data => { setDescription(data.description); });
    }, [formName, apiUrl])

    const uniqueComposers = [...new Set(allOpus.map(opus => opus.composer))].sort();

    const filteredOpus = selectedComposer
        ? allOpus.filter(opus => opus.composer === selectedComposer)
        : allOpus;
  
    return (
        <div className='form-ranking-table'>
            <div className='description'>
                <h3><b>{formName}</b></h3>
                <p>{description}</p>

                {topComposers.length > 0 && (
                    <div className="top-forms">
                        <h3>Most Notable Composers</h3>
                        <div className="forms-list">
                            {topComposers.map((composer, index) => (
                                <div key={composer} className="top-form-item">
                                    <span className="form-rank">{index + 1}</span>
                                    <Link 
                                        to={`/composer/${encodeURIComponent(composer)}`}
                                        className="form-name"
                                    >
                                        {composer}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="composer-filter">
                    <select 
                        value={selectedComposer}
                        onChange={(e) => setSelectedComposer(e.target.value)}
                        className="composer-select"
                    >
                        <option value="" disabled>Filter works by composer...</option>
                        <option value="">All Composers</option>
                        {uniqueComposers.map(composer => (
                            <option key={composer} value={composer}>{composer}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredOpus.length === 0 ? (
                <p>No work found for this musical form</p>
            ) : (
                filteredOpus.map((opus, i) => (
                    <OpusBox key={i} opus={opus} index={i} info={"composer"} />
                ))
            )}
        </div>
    );
}

export default FormRanking