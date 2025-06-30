import React from 'react';
// import { Character } from '../types/character'; // Will create this type later

// interface CharacterCardProps {
//   character: Character; // Assuming Character type will be defined
// }

// const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
const CharacterCard: React.FC<any> = ({ character }) => { // Using 'any' for now
  if (!character) {
    return <p>Loading character data...</p>;
  }

  return (
    <div className="character-card">
      {/* <img src={character.imageUrl} alt={character.name} /> */}
      <h3>{character.name || 'Unnamed Character'}</h3>
      <p>{character.type || 'No type specified'}</p>
      {/* Add more details as needed */}
      {/* <button>View Details</button> */}
    </div>
  );
};

export default CharacterCard;
