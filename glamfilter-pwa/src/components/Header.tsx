import React from 'react';
import { Link } from 'react-router-dom'; // Assuming react-router-dom is used for navigation

const Header: React.FC = () => {
  return (
    <header style={{ background: '#f8f8f8', padding: '10px 20px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
      <div className="logo" style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>
          GlamFilter Companion
        </Link>
      </div>
      <nav style={{ marginTop: '10px' }}>
        <Link to="/" style={{ margin: '0 10px', textDecoration: 'none' }}>Showcase</Link>
        <Link to="/tips" style={{ margin: '0 10px', textDecoration: 'none' }}>Tips</Link>
        <Link to="/download" style={{ margin: '0 10px', textDecoration: 'none', fontWeight: 'bold', color: '#E91E63' }}>Get AR App</Link>
      </nav>
    </header>
  );
};

export default Header;
