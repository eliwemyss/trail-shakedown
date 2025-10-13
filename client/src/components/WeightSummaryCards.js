import React from 'react';
import PropTypes from 'prop-types';

const WeightSummaryCards = ({ data }) => {
  if (!data) return null;
  const { currentWeight, potentialWeight, potentialSavings } = data;

  const arrow = '→';

  return (
    <div className="weight-summary-grid">
      <div className="weight-summary-card">
        <div className="weight-summary-value">
          {currentWeight?.oz} {arrow} {potentialWeight?.oz}
        </div>
        <div className="weight-summary-label">Base Weight (oz)</div>
      </div>
      <div className="weight-summary-card">
        <div className="weight-summary-value">-{potentialSavings?.oz}oz</div>
        <div className="weight-summary-label">Potential Savings</div>
      </div>
      <div className="weight-summary-card">
        <div className="weight-summary-value">-{potentialSavings?.lbs}lbs</div>
        <div className="weight-summary-label">Weight Reduction</div>
      </div>
    </div>
  );
};

export default WeightSummaryCards;

WeightSummaryCards.propTypes = {
  data: PropTypes.shape({
    currentWeight: PropTypes.shape({ oz: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) }),
    potentialWeight: PropTypes.shape({ oz: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) }),
    potentialSavings: PropTypes.shape({
      oz: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      lbs: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    })
  })
};
