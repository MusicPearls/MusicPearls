import React, { useState } from 'react'
import './OpusBox.css'
import OpusDescription from './OpusDescription';
import { getOrdinal } from '../utils/getOrdinal';

function OpusBox( { opus, index } ) {

    const [expanded, setExpanded] = useState(false);
    const toggleExpand = () => {
        setExpanded(!expanded);
    }

    const getMedalImage = (rank) => {
        if (rank === 1) {
          return '/gold.png';
        } else if (rank === 2) {
          return '/silver.png';
        } else if (rank === 3) {
          return '/bronze.png';
        }
        return null;
      };

    const handleBoxClick = (e) => {
      if (e.target.tagName !== 'BUTTON') {
          toggleExpand();
      }
    };

    const medalImage = getMedalImage(index + 1);
    const popularity = opus.formPopularity ? opus.formPopularity : opus.composerPopularity

  return (
    <div className={`opus-box ${expanded ? 'expanded' : ''}`} onClick={handleBoxClick}>
        <p>
            <b>{getOrdinal(index + 1)} Place</b> {medalImage && <img src={medalImage} alt={`${getOrdinal(index+1)} Medal`} className="medal-image" />}<br />
            <b>Name</b>: {opus.opusName}<br />
            <b>Composer</b>: {opus.composer} <br />
            <b>Popularity</b>: {Number(popularity).toFixed(2)}<br />
            <b>Recordings</b>: {opus.recordingCount}
        </p>
        {expanded && (
        <div>
            <OpusDescription opus={opus.opusName} composer={opus.composer}/>
        </div>
        )}
            <button onClick={(e) => { e.stopPropagation(); toggleExpand(); }}>
                {expanded ? 'Collapse' : 'Show more'}
            </button>
    </div>
  );
};

export default OpusBox
