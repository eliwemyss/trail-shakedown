import React from 'react';
import PropTypes from 'prop-types';

const LookingGoodCard = ({ message }) => {
  if (!message) return null;
  return (
    <div className="looking-good-card">
      <div className="checkmark">✓</div>
      <div>
        <div className="message">Looking Good</div>
        <div className="looking-good-content">
          <strong>Overall Assessment:</strong> {message}
        </div>
      </div>
    </div>
  );
};

export default LookingGoodCard;

LookingGoodCard.propTypes = {
  message: PropTypes.string
};
