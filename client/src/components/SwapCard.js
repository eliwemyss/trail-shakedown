import React from 'react';
import PropTypes from 'prop-types';

const formatPrice = (p) => (p || p === 0) ? `$${Number(p).toLocaleString()}` : '';

const SwapCard = ({ rec }) => {
  if (!rec) return null;
  const handleCopy = () => {
    const text = `Swap ${rec.currentItem?.name} (${rec.currentItem?.weight_oz}oz) -> ${rec.recommendedItem?.name} (${rec.recommendedItem?.weight_oz}oz). Saves ${rec.savingsOz}oz. Why: ${rec.why || ''}`;
    navigator.clipboard?.writeText(text);
  };
  return (
    <div className="swap-card">
      <div className="swap-badge">SWAP</div>
      <div className="swap-savings">-{rec.savingsOz}oz savings</div>

      <div className="swap-comparison">
        <div className="swap-item current">
          <div className="swap-item-name">{rec.currentItem?.name}</div>
          <div className="swap-item-details">
            {rec.currentItem?.weight_oz}oz {rec.currentItem?.price ? `• ${formatPrice(rec.currentItem.price)}` : ''}
          </div>
        </div>
        <div className="swap-arrow">→</div>
        <div className="swap-item recommended">
          <div className="swap-item-name">
            {rec.recommendedItem?.url ? (
              <a href={rec.recommendedItem.url} target="_blank" rel="noreferrer">
                {rec.recommendedItem.name}
              </a>
            ) : (
              rec.recommendedItem?.name
            )}
          </div>
          <div className="swap-item-details">
            {rec.recommendedItem?.weight_oz}oz {rec.recommendedItem?.price ? `• ${formatPrice(rec.recommendedItem.price)}` : ''}
          </div>
        </div>
      </div>

      {rec.why && (
        <div className="swap-why">
          <strong>Why:</strong> {rec.why}
          <div style={{ marginTop: '0.5rem' }}>
            <button type="button" onClick={handleCopy} className="btn-copy">Copy recommendation</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwapCard;

SwapCard.propTypes = {
  rec: PropTypes.shape({
    savingsOz: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    why: PropTypes.string,
    currentItem: PropTypes.shape({
      name: PropTypes.string,
      weight_oz: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }),
    recommendedItem: PropTypes.shape({
      name: PropTypes.string,
      weight_oz: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    })
  })
};
