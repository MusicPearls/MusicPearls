import React, { useState } from 'react'
import './OpusBox.css'
import OpusDescription from './OpusDescription';
import { getOrdinal } from '../utils/getOrdinal';

function OpusBox({ opus, index, info }) {
    const [expanded, setExpanded] = useState(false);
    const toggleExpand = () => {
        setExpanded(!expanded);
    }

    const getMedalImage = (rank) => {
        if (rank === 1) return '/gold.png';
        if (rank === 2) return '/silver.png';
        if (rank === 3) return '/bronze.png';
        return null;
    };

    const handleBoxClick = (e) => {
        if (e.target.tagName !== 'BUTTON') {
            toggleExpand();
        }
    };

    const medalImage = getMedalImage(index + 1);
    const popularity = opus.formPopularity ? opus.formPopularity : opus.composerPopularity;

    let addInfo
    let hrefLink
    if (info === "composer") {
        addInfo = opus.composer
        hrefLink = `/composer/${encodeURIComponent(opus.composer)}`
    }
    else {
        addInfo = opus.form
        hrefLink = `/form/${encodeURIComponent(opus.form)}`
    }

    return (
        <div className={`opus-box ${expanded ? 'expanded' : ''}`} onClick={handleBoxClick}>
            <div className="opus-header">
                <div className="opus-title">
                    <span className="rank">
                        {getOrdinal(index + 1)} Place
                        {medalImage && <img src={medalImage} alt={`${getOrdinal(index+1)} Medal`} className="medal-image" />}
                    </span>
                    <h3>{opus.opusname}</h3>
                    <p className="additional-info">
                        <a href={hrefLink} target="_blank" rel="noopener noreferrer" className="additional-info">
                            {addInfo}
                        </a>
                    </p>
                </div>
                <div className="opus-stats">
                    <p>Popularity: {Number(popularity).toFixed(2)}</p>
                    <p>Recordings: {opus.recordingCount}</p>
                </div>
            </div>
            
            {expanded && (
                <div className="opus-description">
                    <OpusDescription opus={opus.opusname} composer={opus.composer}/>
                </div>
            )}
            
            <div className="opus-actions">
                <button onClick={(e) => { e.stopPropagation(); toggleExpand(); }}>
                    {expanded ? 'Show less' : 'Show more'}
                </button>
                {opus.representativeTrack && (
                    <a 
                        href={`https://open.spotify.com/track/${opus.representativeTrack}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="spotify-link"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Listen to this →
                    </a>
                )}
            </div>
        </div>
    );
}

export default OpusBox
