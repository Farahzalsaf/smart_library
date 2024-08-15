import React, { useState } from 'react';
import styles from './LoginDropdown.module.css';

interface LoginDropdownProps {
  navigateTo: (page: string) => void;
  isAuthenticated: boolean;
  setAuthenticated: (isAuthenticated: boolean) => void;
}

const LoginDropdown: React.FC<LoginDropdownProps> = ({ navigateTo, isAuthenticated, setAuthenticated }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setAuthenticated(false);
    navigateTo('loginSignup');
  };

  return (
    <div className={styles.dropdownContainer}>
      <button onClick={toggleDropdown} className={styles.dropdownButton}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_85_10022" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="4" y="14" width="16" height="8">
            <path fillRule="evenodd" clipRule="evenodd" d="M4 14.4961H19.8399V21.8701H4V14.4961Z" fill="white" />
          </mask>
          <g mask="url(#mask0_85_10022)">
            <path fillRule="evenodd" clipRule="evenodd" d="M11.921 15.9961C7.66 15.9961 5.5 16.7281 5.5 18.1731C5.5 19.6311 7.66 20.3701 11.921 20.3701C16.181 20.3701 18.34 19.6381 18.34 18.1931C18.34 16.7351 16.181 15.9961 11.921 15.9961ZM11.921 21.8701C9.962 21.8701 4 21.8701 4 18.1731C4 14.8771 8.521 14.4961 11.921 14.4961C13.88 14.4961 19.84 14.4961 19.84 18.1931C19.84 21.4891 15.32 21.8701 11.921 21.8701Z" fill="#41D0C8" />
          </g>
          <mask id="mask1_85_10022" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="6" y="2" width="12" height="11">
            <path fillRule="evenodd" clipRule="evenodd" d="M6.61035 2.00012H17.2304V12.6187H6.61035V2.00012Z" fill="white" />
          </mask>
          <g mask="url(#mask1_85_10022)">
            <path fillRule="evenodd" clipRule="evenodd" d="M11.9214 3.42769C9.78038 3.42769 8.03838 5.16869 8.03838 7.30969C8.03138 9.4437 9.76038 11.1837 11.8924 11.1917L11.9214 11.9057V11.1917C14.0614 11.1917 15.8024 9.44969 15.8024 7.30969C15.8024 5.16869 14.0614 3.42769 11.9214 3.42769ZM11.9214 12.6187H11.8894C8.96738 12.6097 6.60038 10.2267 6.61038 7.30669C6.61038 4.3817 8.99238 1.99969 11.9214 1.99969C14.8494 1.99969 17.2304 4.38169 17.2304 7.30969C17.2304 10.2377 14.8494 12.6187 11.9214 12.6187Z" fill="#41D0C8" />
          </g>
        </svg>
      </button>
      {isOpen && (
        <div className={`${styles.dropdownMenu} ${isOpen ? styles.show : ''}`}>
          <ul>
            {isAuthenticated ? (
              <>
                <li onClick={() => navigateTo('profile')}>Profile</li>
                <li onClick={() => navigateTo('adminPanel')}>Admin Panel</li>
                <li onClick={handleSignOut} style={{ color: 'red' }}>Sign Out</li>
              </>
            ) : (
              <>
                <li onClick={() => navigateTo('loginSignup')}>Log In</li>
                <li onClick={() => navigateTo('loginSignup')}>Sign Up</li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LoginDropdown;
