import React from 'react';

// Define a type for makeup item props later, e.g.:
// interface MakeupItem {
//   id: string;
//   name: string;
//   imageUrl?: string; // URL for swatch or model image
//   category: 'lipstick' | 'eyeshadow' | 'blush';
//   description?: string;
// }
// interface MakeupItemCardProps {
//   item: MakeupItem;
// }

const MakeupItemCard: React.FC<any> = ({ item }) => { // Using 'any' for MVP placeholder
  if (!item) {
    return <div style={{border: '1px solid #eee', padding: '15px', textAlign: 'center'}}>Loading...</div>;
  }

  return (
    <div className="makeup-item-card" style={{border: '1px solid #ddd', padding: '15px', borderRadius: '8px', textAlign: 'center'}}>
      {/* <img src={item.imageUrl || '/images/placeholder-swatch.png'} alt={item.name} style={{width: '100px', height: '100px', objectFit: 'cover', marginBottom: '10px'}}/> */}
      <div style={{width: '100px', height: '100px', background: item.color || '#e0e0e0', margin: '0 auto 10px', borderRadius: '4px', display:'flex', alignItems:'center', justifyContent:'center'}}>
        {item.imageUrl ? <img src={item.imageUrl} alt={item.name} style={{maxWidth: '100%', maxHeight: '100%'}} /> : <p style={{fontSize: '0.8em', color: '#777'}}>Image</p>}
      </div>
      <h3 style={{fontSize: '1.1em', marginBottom: '5px'}}>{item.name || 'Item Name'}</h3>
      <p style={{fontSize: '0.9em', color: '#666', marginBottom: '10px'}}>{item.category || 'Category'}</p>
      {/* <p style={{fontSize: '0.8em', color: '#777'}}>{item.description || 'Brief description of the makeup item.'}</p> */}
    </div>
  );
};

export default MakeupItemCard;
