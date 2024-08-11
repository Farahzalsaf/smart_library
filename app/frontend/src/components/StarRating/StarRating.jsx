import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

const StarRating = ({ rating }) => {
  const uniqueId = uuidv4();
  const percentage = Math.max(0.1, (rating / 6) * 100);

  return (
    <svg
      width="100%" 
      height="100%"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', backgroundColor: 'transparent' }}
    >
      <defs>
        <linearGradient id={`gradient-${uniqueId}`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset={`${percentage}%`} stopColor="#FFE45A" />
          <stop offset={`${percentage}%`} stopColor="transparent" /> 
        </linearGradient>
      </defs>
      <path
        d="M22,9.81a1,1,0,0,0-.83-.69l-5.7-.78L12.88,3.53a1,1,0,0,0-1.76,0L8.57,8.34l-5.7.78a1,1,0,0,0-.82.69,1,1,0,0,0,.28,1l4.09,3.73-1,5.24A1,1,0,0,0,6.88,20.9L12,18.38l5.12,2.52a1,1,0,0,0,.44.1,1,1,0,0,0,1-1.18l-1-5.24,4.09-3.73A1,1,0,0,0,22,9.81Z"
        fill={`url(#gradient-${uniqueId})`}
        stroke="#FFE45A"
        strokeWidth="1"
      />
    </svg>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default StarRating;
