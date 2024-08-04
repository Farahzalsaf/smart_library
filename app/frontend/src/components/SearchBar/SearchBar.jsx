import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DropdownButton from '../Button/DropdownButton';
import HeartButton from '../Button/HeartIcon';


const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      onSearch(query);
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <button className="button" onClick={() => onSearch(query)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_1_1860" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="2" y="2" width="20" height="20">
              <path fillRule="evenodd" clipRule="evenodd" d="M2 2H21.4768V21.477H2V2Z" fill="white"/>
            </mask>
            <g mask="url(#mask0_1_1860)">
              <path fillRule="evenodd" clipRule="evenodd" d="M11.7388 3.5C7.19576 3.5 3.49976 7.195 3.49976 11.738C3.49976 16.281 7.19576 19.977 11.7388 19.977C16.2808 19.977 19.9768 16.281 19.9768 11.738C19.9768 7.195 16.2808 3.5 11.7388 3.5ZM11.7388 21.477C6.36876 21.477 1.99976 17.108 1.99976 11.738C1.99976 6.368 6.36876 2 11.7388 2C17.1088 2 21.4768 6.368 21.4768 11.738C21.4768 17.108 17.1088 21.477 11.7388 21.477Z" fill="white"/>
            </g>
            <mask id="mask1_1_1860" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="17" y="17" width="6" height="6">
              <path fillRule="evenodd" clipRule="evenodd" d="M17.24 17.7069H22.264V22.7217H17.24V17.7069Z" fill="white"/>
            </mask>
            <g mask="url(#mask1_1_1860)">
              <path fillRule="evenodd" clipRule="evenodd" d="M21.5142 22.7217C21.3232 22.7217 21.1312 22.6487 20.9842 22.5027L17.4602 18.9887C17.1672 18.6957 17.1662 18.2207 17.4592 17.9277C17.7512 17.6327 18.2262 17.6347 18.5202 17.9257L22.0442 21.4407C22.3372 21.7337 22.3382 22.2077 22.0452 22.5007C21.8992 22.6487 21.7062 22.7217 21.5142 22.7217Z" fill="white"/>
            </g>
          </svg>
        </button>
        <input
          type="text"
          placeholder="Type book title/genre/name of author"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="dropdown-container">
          <DropdownButton />
        </div>
        <div className="heart-button-container">
          <HeartButton />
        </div>
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
