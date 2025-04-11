import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <section className="about-section">
        <h2>About</h2>
        <p>
          <strong>Music Pearls</strong> is a free website that helps you explore classical music. Whether you're a seasoned listener or just starting out, you will find your next musical adventure here. This site provides ranked lists of compositions by composer and form, powered by real-world listening data. Popularity metrics focus on complete works—not just individual movements—to offer a clearer picture of most iconic pieces.
        </p>
      </section>

      <section className="about-section">
        <h2>How It Works</h2>
        <p>We use Spotify's listening data to rank classical music. Spotify assigns each track a popularity score based on the number and recency of its streams. We then apply a three-step process:</p>
        <ul>
          <li>
            <strong>Grouping:</strong> Tracks that belong to the same work (e.g.: four movements of a symphony) are combined into a single entry, using the average popularity of the constituent tracks.
          </li>
          <li>
            <strong>Normalizing:</strong> We adjust Spotify's popularity scores to account for the number of recordings of the work, so that a piece with lots of recordings receives a higher base popularity.
          </li>
          <li>
            <strong>Filtering:</strong> To keep results meaningful, we only show works with enough recordings to make it relevant—aiming for at least 10 per category.
          </li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Limitations & Accuracy</h2>
        <ul>
          <li>
            <strong>Classification:</strong> We use a mix of regular expressions, AI, and manual review to categorize over a million tracks. Some works may still be missing or miscategorized, but we continue improving the system with each update.
          </li>
          <li>
            <strong>Descriptions:</strong> Composer and work descriptions are fetched from Wikipedia. While usually accurate, occasional mismatches can happen.
          </li>
        </ul>
      </section>

      <section className="about-section">

    <h2>More Details</h2>
    <p>
      Curious about how it all works under the hood? Visit our GitHub repositories:
    </p>
    <ul>
    <li>
        <a href="https://github.com/MusicPearls/Pearls-Parser" target="_blank" rel="noopener noreferrer">
          Pearls-Parser
        </a> - More detailed info on how we fetch and process data
      </li>
      <li>
        <a href="https://github.com/MusicPearls/MusicPearls" target="_blank" rel="noopener noreferrer">
          MusicPearls
        </a> - General structure of the website
      </li>
    </ul>
  </section>
    </div>
  );
}

export default About;
