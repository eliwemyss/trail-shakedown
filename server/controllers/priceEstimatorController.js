const { estimatePrice } = require('../services/priceEstimator');

// @desc    Estimate price for a single gear item
// @route   POST /api/price-estimate
// @access  Public
exports.estimateSinglePrice = async (req, res) => {
  try {
    const { name, category, weight_oz } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Item name and category are required'
      });
    }

    const estimatedPrice = estimatePrice(name, category, weight_oz);

    res.status(200).json({
      success: true,
      data: {
        name,
        category,
        estimatedPrice,
        note: 'Price is an estimate based on typical market values'
      }
    });
  } catch (error) {
    console.error('Error estimating price:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
