import React from 'react';
import { Link } from 'react-router-dom';

// Define a type for tip props later, e.g.:
// interface TipSummary {
//   slug: string;
//   title: string;
//   summary: string;
//   thumbnailUrl?: string;
// }
// interface TipSummaryCardProps {
//   tip: TipSummary;
// }

const TipSummaryCard: React.FC<any> = ({ tip }) => { // Using 'any' for MVP placeholder
  if (!tip) {
    return <div style={{border: '1px solid #eee', padding: '15px', marginBottom: '15px'}}>Loading...</div>;
  }

  const tipLink = tip.slug ? `/tips/${tip.slug}` : '#';

  return (
    <div className="tip-summary-card" style={{border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '15px'}}>
      {/* {tip.thumbnailUrl &&
        <img src={tip.thumbnailUrl} alt={tip.title} style={{width: '100%', height: '150px', objectFit: 'cover', marginBottom: '10px', borderRadius: '4px'}}/>
      } */}
      <Link to={tipLink} style={{textDecoration: 'none', color: 'inherit'}}>
        <h3 style={{fontSize: '1.2em', marginBottom: '5px'}}>{tip.title || 'Tip Title'}</h3>
      </Link>
      <p style={{fontSize: '0.9em', color: '#666'}}>{tip.summary || 'Short summary of the tip...'}</p>
      <Link to={tipLink} style={{display: 'inline-block', marginTop: '10px', fontSize: '0.9em'}}>
        Read More
      </Link>
    </div>
  );
};

export default TipSummaryCard;
