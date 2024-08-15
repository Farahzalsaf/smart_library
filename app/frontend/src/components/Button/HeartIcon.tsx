import React from 'react';
import '../Button/HeartIcon.module.css';

interface HeartButtonProps {
  navigateTo: (page: string) => void;
}

const HeartButton: React.FC<HeartButtonProps> = ({ navigateTo }) => {
  const handleClick = () => {
    if (typeof navigateTo === 'function') {
      navigateTo('favorites');
    } else {
      console.error('navigateTo is not a function or is undefined');
    }
  };

  return (
    <button onClick={handleClick} className="heart-button">
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask 
          id="mask0_18_9487" 
          style={{ maskType: "luminance" }} 
          maskUnits="userSpaceOnUse" 
          x="2" 
          y="3" 
          width="21" 
          height="20"
        >
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M2 2.99991H22.4725V22.5009H2V2.99991Z" 
            fill="white"
          />
        </mask>
        <g mask="url(#mask0_18_9487)">
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M3.82347 12.123C5.22547 16.485 10.7645 20.012 12.2365 20.885C13.7135 20.003 19.2925 16.437 20.6495 12.127C21.5405 9.341 20.7135 5.812 17.4275 4.753C15.8355 4.242 13.9785 4.553 12.6965 5.545C12.4285 5.751 12.0565 5.755 11.7865 5.551C10.4285 4.53 8.65447 4.231 7.03747 4.753C3.75647 5.811 2.93247 9.34 3.82347 12.123ZM12.2375 22.501C12.1135 22.501 11.9905 22.471 11.8785 22.41C11.5655 22.239 4.19247 18.175 2.39547 12.581C2.39447 12.581 2.39447 12.58 2.39447 12.58C1.26647 9.058 2.52247 4.632 6.57747 3.325C8.48147 2.709 10.5565 2.98 12.2345 4.039C13.8605 3.011 16.0205 2.727 17.8865 3.325C21.9455 4.634 23.2055 9.059 22.0785 12.58C20.3395 18.11 12.9125 22.235 12.5975 22.408C12.4855 22.47 12.3615 22.501 12.2375 22.501Z" 
            fill="#FF529A"
          />
        </g>
      </svg>
    </button>
  );
};

export default HeartButton;
