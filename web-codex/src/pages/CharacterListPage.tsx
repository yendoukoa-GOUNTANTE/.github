import React from 'react';

// Placeholder components, will be created later
// import SearchBar from '../components/SearchBar';
// import FilterControls from '../components/FilterControls';
// import CharacterCard from '../components/CharacterCard';

const CharacterListPage: React.FC = () => {
  return (
    <div>
      <h2>Character List</h2>
      {/* <SearchBar /> */}
      {/* <FilterControls /> */}
      <div className="character-grid">
        {/* Placeholder for character cards */}
        <p>Character cards will be displayed here...</p>
        {/* Example: <CharacterCard character={someCharacterData} /> */}
      </div>
    </div>
  );
};

export default CharacterListPage;
