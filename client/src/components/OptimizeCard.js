import React from 'react';
import PropTypes from 'prop-types';

const OptimizeCard = ({ rec }) => {
  if (!rec) return null;
  const suggestionText = rec.message || `${rec.category ? `${rec.category}: ` : ''}${rec.currentItem || ''} ${rec.weight_oz ? `(${rec.weight_oz}oz)` : ''} ${rec.suggestion || ''}`;
  const handleCopy = () => {
    navigator.clipboard?.writeText(suggestionText);
  };
  return (
    <div className="optimize-card">
      <div className="optimize-badge">OPTIMIZE</div>
      <div className="optimize-label">Consider</div>
      <div className="optimize-content">
        <strong>Your Pack:</strong> {rec.message || (
          <>
            {rec.category ? `${rec.category}: ` : ''}
            {rec.currentItem} {rec.weight_oz ? `(${rec.weight_oz}oz)` : ''} {rec.suggestion || ''}
          </>
        )}
        <div style={{ marginTop: '0.5rem' }}>
          <button type="button" onClick={handleCopy} className="btn-copy">Copy suggestion</button>
        </div>
      </div>
    </div>
  );
};

export default OptimizeCard;

OptimizeCard.propTypes = {
  rec: PropTypes.shape({
    message: PropTypes.string,
    category: PropTypes.string,
    currentItem: PropTypes.string,
    weight_oz: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    suggestion: PropTypes.string
  })
};
