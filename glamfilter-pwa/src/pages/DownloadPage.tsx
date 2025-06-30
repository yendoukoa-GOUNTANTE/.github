import React from 'react';

const DownloadPage: React.FC = () => {
  const appStoreUrl = "#"; // Placeholder
  const googlePlayUrl = "#"; // Placeholder

  return (
    <div className="download-page" style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Experience Virtual Makeovers Like Never Before!</h2>
      <p style={{ margin: '20px 0' }}>
        Try on countless makeup styles in real-time with GlamFilter AR.
        Experiment with lipsticks, eyeshadows, blushes, and more, all from your phone!
      </p>

      {/* Placeholder for app demo image/gif */}
      <div style={{ margin: '30px 0', background: '#f0f0f0', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>[App Demo Video/GIF Placeholder]</p>
      </div>

      <h3>Download GlamFilter AR Now!</h3>
      <div style={{ marginTop: '20px' }}>
        <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" style={{ marginRight: '10px' }}>
          <img src="/images/app-store-badge.png" alt="Download on the App Store" style={{ height: '50px' }} />
          {/* Actual badge image would be in public/images/ */}
        </a>
        <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer">
          <img src="/images/google-play-badge.png" alt="Get it on Google Play" style={{ height: '50px' }} />
          {/* Actual badge image would be in public/images/ */}
        </a>
      </div>
      <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
        (App store links are placeholders)
      </p>
    </div>
  );
};

export default DownloadPage;
