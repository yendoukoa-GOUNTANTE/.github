import React from 'react';

// Example filter options - this would be more dynamic in a real app
const characterTypes = ['All', 'Hunter', 'Monster', 'Shadow'];
const characterRanks = ['All', 'S-Rank', 'A-Rank', 'B-Rank', 'C-Rank', 'D-Rank', 'E-Rank'];

interface FilterControlsProps {
  onFilterChange: (filterType: string, filterValue: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ onFilterChange }) => {
  return (
    <div className="filter-controls">
      <div>
        <label htmlFor="type-filter">Type: </label>
        <select
          id="type-filter"
          onChange={(e) => onFilterChange('type', e.target.value)}
        >
          {characterTypes.map(type => (
            <option key={type} value={type.toLowerCase()}>{type}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="rank-filter">Rank: </label>
        <select
          id="rank-filter"
          onChange={(e) => onFilterChange('rank', e.target.value)}
        >
          {characterRanks.map(rank => (
            <option key={rank} value={rank.toLowerCase()}>{rank}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterControls;
