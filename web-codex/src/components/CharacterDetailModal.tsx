import React from 'react';
// import { Character } from '../types/character'; // Will create this type later

// interface CharacterDetailModalProps {
//   character: Character | null; // Character can be null if no modal is shown or data is loading
//   onClose: () => void;
// }

// const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({ character, onClose }) => {
const CharacterDetailModal: React.FC<any> = ({ character, onClose }) => { // Using 'any' for now
  if (!character) {
    return null; // Don't render anything if no character is selected
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{character.name || 'Unnamed Character'}</h2>
        {/* <img src={character.imageUrl} alt={character.name} style={{ maxWidth: '100%', height: 'auto' }} /> */}
        <p><strong>Type:</strong> {character.type || 'N/A'}</p>
        <p><strong>Rank:</strong> {character.rank || 'N/A'}</p>
        <p><strong>Description:</strong> {character.description || 'No description available.'}</p>
        <div>
          <strong>Abilities:</strong>
          {/* <ul>
            {character.abilities?.map((ability: string, index: number) => (
              <li key={index}>{ability}</li>
            ))}
          </ul> */}
        </div>
        <div>
          <strong>Stats:</strong>
          {/* <pre>{JSON.stringify(character.stats, null, 2)}</pre> */}
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CharacterDetailModal;
