import React from 'react';
// import { Link } from 'react-router-dom'; // For navigation to detail page
// import TipSummaryCard from '../components/TipSummaryCard'; // Create later
// import tipsData from '../data/tips.json'; // Create later

const TipsListPage: React.FC = () => {
  // const tips = tipsData; // Load data later

  return (
    <div className="tips-list-page">
      <h2>Makeup Tips & Tutorials</h2>
      <div className="tips-grid" style={{ marginTop: '20px' }}>
        {/* Placeholder items - map over actual data later */}
        <div className="tip-summary-placeholder" style={{border: '1px solid #ccc', padding: '10px', marginBottom: '10px'}}>
          {/* <Link to="/tips/tip-1-slug"> */}
            <h3>Tip 1 Title Placeholder</h3>
            <p>Short summary of tip 1...</p>
          {/* </Link> */}
        </div>
        <div className="tip-summary-placeholder" style={{border: '1px solid #ccc', padding: '10px', marginBottom: '10px'}}>
          {/* <Link to="/tips/tip-2-slug"> */}
            <h3>Tip 2 Title Placeholder</h3>
            <p>Short summary of tip 2...</p>
          {/* </Link> */}
        </div>
      </div>
    </div>
  );
};

export default TipsListPage;
