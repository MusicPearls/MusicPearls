import React from 'react';
import { Link } from 'react-router-dom';
import Changelog from './Changelog';
import './Home.css';

const Home = () => {
  return (
    <div className="home-div">
      <div className="hero">
        <h1>Welcome to <b>Music Pearls</b></h1>
        <p className="subtitle">Your guide to explore and discover classical music - from Gregorian chants of the medieval era to modern-day movie soundtracks</p>
      </div>

      <div className="nav-options">
        <h3>Explore:</h3>
        <Link to="/composers" className="nav-button">🎼 Composers</Link>
        <Link to="/forms" className="nav-button">🎹 Musical Forms</Link>
        <p className="about-note">
          Want to know how it works? Visit the <Link to="/about">About</Link> page.
        </p>
      </div>

      <div className="changelog-section">
        <Changelog />
      </div>
    </div>
  );
};

export default Home;
