import React, { useEffect, useState } from 'react'
import './OpusDescription.css';

function OpusDescription( {composer, opus} ) {

    const [description, setDescription] = useState('');
    const [wikiUrl, setWikiUrl] = useState('');
    const [error, setError] = useState('');
    const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_BASE_URL
    : process.env.REACT_APP_LOCAL_API_BASE_URL;


    useEffect ( () => {
        const fetchDescription = async () => {
            try {
                const queryParams = new URLSearchParams({
                    opus: opus,
                    composer: composer
                });
                const response = await fetch(`${apiUrl}/wiki/opus?${queryParams}`);
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to fetch description');
                }
                const data = await response.json();
                setDescription(data.summary);
                setWikiUrl(data.fullUrl);
                setError('');
            } catch (err) {
                setError(err.message || 'Summary info not fetched');
                setDescription('');
                setWikiUrl('');
            }
        }
        fetchDescription();
    }, [composer, opus, apiUrl]);

    return (
    <div className="opus-description">
       {error ? <p className="error-message">{error}</p> : 
        (description ? (
            <>
                <p className="description-text">{description}</p>
                {wikiUrl && (
                    <p className="wiki-link">
                        <a href={wikiUrl} target="_blank" rel="noopener noreferrer">
                            See more →
                        </a>
                    </p>
                )}
            </>
        ) : <p className="loading-message">Loading...</p>)}
    </div>
    )
}

export default OpusDescription