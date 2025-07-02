import React from 'react';
// import MakeupItemCard from '../components/MakeupItemCard'; // Create later
// import makeupItemsData from '../data/makeup-items.json'; // Create later

const ShowcasePage: React.FC = () => {
  // const items = makeupItemsData; // Load data later

  return (
    <div className="showcase-page">
      <h2>Virtual Makeup Showcase</h2>
      <p>Discover the amazing looks you can try in the GlamFilter AR app!</p>
      <div className="makeup-grid" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {/* Placeholder items - map over actual data later */}
        <div className="makeup-item-card-placeholder" style={{border: '1px solid #ccc', padding: '10px'}}>Item 1 Placeholder (e.g., Lipstick)</div>
        <div className="makeup-item-card-placeholder" style={{border: '1px solid #ccc', padding: '10px'}}>Item 2 Placeholder (e.g., Eyeshadow)</div>
        <div className="makeup-item-card-placeholder" style={{border: '1px solid #ccc', padding: '10px'}}>Item 3 Placeholder (e.g., Blush)</div>
      </div>
      <div style={{marginTop: '30px', textAlign: 'center'}}>
        {/* Link to DownloadPage later */}
        <button>Try These in AR! Download GlamFilter AR</button>
      </div>
    </div>
  );
};

export default ShowcasePage;
