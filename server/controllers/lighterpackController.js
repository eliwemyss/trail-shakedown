const axios = require('axios');
const cheerio = require('cheerio');
const { estimatePricesForGearList } = require('../services/priceEstimator');

// @desc    Import gear list from Lighterpack URL
// @route   POST /api/lighterpack/import
// @access  Public
exports.importFromLighterpack = async (req, res) => {
  try {
    const { url } = req.body;

    // Validate URL
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Lighterpack URL is required'
      });
    }

    // Validate it's a lighterpack URL
    if (!url.includes('lighterpack.com')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Lighterpack URL'
      });
    }

    // Fetch the Lighterpack page
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const gearList = [];

    // Parse items directly from HTML
    $('.lpCategory').each((catIndex, category) => {
      const categoryName = $(category).find('.lpCategoryName').text().trim();

      $(category).find('.lpItem').each((itemIndex, item) => {
        const $item = $(item);

        // Get item name and attempt to split brand/model
        let rawName = $item.find('.lpName').text().trim();
        let name = rawName;
        // Try explicit brand/desc/note cells
        let brand = $item.find('.lpBrand, .lpDesc, .lpDescription, .lpNote').first().text().trim();
        // Try adjacent TDs (next to name cell)
        if (!brand) {
          const nameCell = $item.find('.lpName').closest('td');
          if (nameCell && nameCell.length) {
            // Try next and previous TDs
            const adjText = nameCell.next('td').text().trim();
            const prevText = nameCell.prev('td').text().trim();
            if (adjText && adjText !== rawName && !/(oz|g|lb|lbs)/i.test(adjText) && !/^\d+(\.\d+)?$/.test(adjText)) {
              brand = adjText;
            } else if (prevText && prevText !== rawName && !/(oz|g|lb|lbs)/i.test(prevText) && !/^\d+(\.\d+)?$/.test(prevText)) {
              brand = prevText;
            }
          }
        }
        // Try second child of row
        if (!brand) {
          const children = $item.children();
          if (children && children.length >= 3) {
            const candidate = children.eq(1).text().trim();
            if (candidate && candidate !== rawName && !/(oz|g|lb|lbs)/i.test(candidate) && !/^\d+(\.\d+)?$/.test(candidate)) {
              brand = candidate;
            }
          }
        }
        // Try parsing brand from name if separated by dash, pipe, or parentheses
        if (!brand && rawName) {
          // Try em-dash or hyphen split
          const dashSplit = rawName.split(/\s*[—–-]\s*/);
          if (dashSplit.length === 2) {
            name = dashSplit[0].trim();
            brand = dashSplit[1].trim();
          } else {
            // Try parentheses
            const parenMatch = rawName.match(/\(([^)]+)\)/);
            if (parenMatch) {
              brand = parenMatch[1].trim();
              name = rawName.replace(/\s*\([^)]+\)\s*/, '').trim();
            } else {
              // Try generic item prefix heuristic
              const tokens = rawName.split(/\s+/);
              if (tokens.length > 2) {
                const genericStarts = ['backpack', 'tent', 'sleeping', 'pad', 'liner', 'jacket', 'hammock', 'filter', 'bottle', 'stove', 'shelter'];
                const first = tokens[0].toLowerCase();
                const second = tokens.length > 1 ? tokens[1].toLowerCase() : '';
                
                if (genericStarts.includes(first)) {
                  if (first === 'sleeping' && (second === 'bag' || second === 'pad')) {
                    name = tokens.slice(0, 2).join(' ');
                    brand = tokens.slice(2).join(' ');
                  } else {
                    name = tokens[0];
                    brand = tokens.slice(1).join(' ');
                  }
                }
              }
            }
          }
        }

        // Get weight - already in ounces
        const weightText = $item.find('.lpWeight').text().trim();
        const weightOz = weightText ? parseFloat(weightText) : 0;

        // Get quantity
        const qtyText = $item.find('.lpQty').text().trim();
        const qty = qtyText ? parseInt(qtyText) : 1;

        // Get price if available
        const priceText = $item.find('.lpPrice').text().trim();
        const price = priceText ? parseFloat(priceText.replace('$', '')) : undefined;

        if (name && weightOz > 0) {
          gearList.push({
            name: name,
            brand: brand, // may be '' if not detected
            category: categoryName || 'Miscellaneous',
            weight_oz: weightOz * qty,
            price: price
          });
        }
      });
    });

    if (gearList.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No gear items found in the Lighterpack list'
      });
    }

    // Estimate prices for items that don't have them
    const gearListWithPrices = estimatePricesForGearList(gearList);

    res.status(200).json({
      success: true,
      data: {
        gearList: gearListWithPrices,
        itemCount: gearListWithPrices.length
      }
    });

  } catch (error) {
    console.error('Error importing from Lighterpack:', error);

    if (error.response) {
      return res.status(400).json({
        success: false,
        message: 'Unable to fetch Lighterpack page. Please check the URL and try again.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while importing from Lighterpack',
      error: error.message
    });
  }
};

// Helper function to get category name from category ID
function getCategoryName(categories, categoryId) {
  if (categories && categories[categoryId]) {
    return categories[categoryId].name;
  }
  return 'Miscellaneous';
}
