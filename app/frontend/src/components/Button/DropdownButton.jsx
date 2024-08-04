import React, { useState } from 'react';
import styles from './DropdownButton.module.css'; // Ensure CSS module path is correct

const DropdownButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.dropdownContainer}>
      <button onClick={toggleDropdown} className={styles.dropdownButton}>
        {/* SVG Icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M10.0803 18.5928H3.7793C3.3653 18.5928 3.0293 18.2568 3.0293 17.8428C3.0293 17.4288 3.3653 17.0928 3.7793 17.0928H10.0803C10.4943 17.0928 10.8303 17.4288 10.8303 17.8428C10.8303 18.2568 10.4943 18.5928 10.0803 18.5928Z" fill="#F7F5FF"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M19.1911 8.90039H12.8911C12.4771 8.90039 12.1411 8.56439 12.1411 8.15039C12.1411 7.73639 12.4771 7.40039 12.8911 7.40039H19.1911C19.6051 7.40039 19.9411 7.73639 19.9411 8.15039C19.9411 8.56439 19.6051 8.90039 19.1911 8.90039Z" fill="#F7F5FF"/>
          <circle cx="6" cy="8" r="2" fill="#F7F5FF"/>
          <circle cx="17.3874" cy="17.804" r="2" fill="#F7F5FF"/>
        </svg>
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <ul>
            <li>Most Trending</li>
            <li>Recently Added</li>
            <li>Recommended</li>
            <li>Most recent publish year</li>
            <li>Earliest publish year</li>
            <li>Top rated</li>
            <li>Least rated</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;





