// Price estimation service for backpacking gear
// Uses pattern matching and category-based pricing

// Known gear database with prices
const knownGearPrices = {
  // Shelters
  'zpacks duplex': 699,
  'big agnes copper spur': 500,
  'big agnes fly creek': 450,
  'msr hubba': 450,
  'nemo dagger': 450,
  'rei quarter dome': 350,
  'gossamer gear the one': 295,
  'tarptent': 350,
  'lanshan': 120,
  '六道神器': 120, // Lanshan Chinese name

  // Sleep System
  'western mountaineering': 550,
  'feathered friends': 500,
  'enlightened equipment': 300,
  'nemo disco': 350,
  'sea to summit': 300,
  'therm-a-rest neoair': 200,
  'nemo tensor': 200,
  'thermarest': 180,
  'klymit': 70,
  'z-lite': 50,

  // Backpacks
  'zpacks arc': 375,
  'hyperlite mountain gear': 365,
  'gossamer gear mariposa': 325,
  'ula circuit': 265,
  'granite gear crown': 200,
  'osprey exos': 250,
  'osprey atmos': 280,
  'gregory paragon': 250,

  // Cooking
  'jetboil': 120,
  'msr pocket rocket': 50,
  'soto windmaster': 70,
  'toaks titanium': 35,
  'snow peak': 60,
  'brs': 20,
  'esbit': 15,

  // Water
  'sawyer squeeze': 40,
  'sawyer mini': 25,
  'katadyn befree': 45,
  'platypus': 35,
  'cnoc': 35,
  'smartwater': 3,

  // Clothing
  'arc\'teryx': 350,
  'montbell plasma': 379,
  'patagonia houdini': 99,
  'outdoor research helium': 200,
  'frogg toggs': 20,

  // Electronics
  'garmin inreach': 350,
  'spot': 150,
  'nitecore nu25': 40,
  'petzl': 45,
  'anker': 35,
  'nitecore nb10000': 50,
};

// Category-based price ranges (fallback)
const categoryPriceRanges = {
  'Shelter': { min: 150, max: 700, typical: 350 },
  'Sleep System': { min: 100, max: 600, typical: 250 },
  'Backpack': { min: 150, max: 400, typical: 280 },
  'Cooking': { min: 20, max: 150, typical: 60 },
  'Water': { min: 10, max: 50, typical: 30 },
  'Clothing': { min: 30, max: 400, typical: 120 },
  'Electronics': { min: 25, max: 400, typical: 80 },
  'First Aid': { min: 15, max: 60, typical: 35 },
  'Misc': { min: 5, max: 40, typical: 15 }
};

// Brand price multipliers
const brandMultipliers = {
  'zpacks': 1.5,
  'hyperlite': 1.4,
  'arc\'teryx': 1.6,
  'western mountaineering': 1.5,
  'feathered friends': 1.5,
  'montbell': 1.3,
  'patagonia': 1.2,
  'enlightened equipment': 1.1,
  'gossamer gear': 1.0,
  'ula': 0.9,
  'granite gear': 0.8,
  'frogg toggs': 0.3,
  'lanshan': 0.3,
  'brs': 0.2,
  'decathlon': 0.5
};

/**
 * Estimate price for a gear item
 * @param {string} itemName - Name of the gear item
 * @param {string} category - Category of the gear
 * @param {number} weight_oz - Weight in ounces (optional, helps with estimation)
 * @returns {number} Estimated price in USD
 */
function estimatePrice(itemName, category, weight_oz = null) {
  const nameLower = itemName.toLowerCase();

  // Check for exact or partial matches in known gear database
  for (const [knownItem, price] of Object.entries(knownGearPrices)) {
    if (nameLower.includes(knownItem) || knownItem.includes(nameLower)) {
      return price;
    }
  }

  // Get base price from category
  const priceRange = categoryPriceRanges[category] || categoryPriceRanges['Misc'];
  let estimatedPrice = priceRange.typical;

  // Adjust based on brand if detected
  for (const [brand, multiplier] of Object.entries(brandMultipliers)) {
    if (nameLower.includes(brand)) {
      estimatedPrice = priceRange.typical * multiplier;
      break;
    }
  }

  // Adjust based on weight (lighter = typically more expensive in ultralight gear)
  if (weight_oz !== null && category === 'Shelter') {
    if (weight_oz < 25) {
      estimatedPrice *= 1.5; // Very ultralight shelters
    } else if (weight_oz < 40) {
      estimatedPrice *= 1.2; // Ultralight shelters
    }
  }

  if (weight_oz !== null && category === 'Backpack') {
    if (weight_oz < 25) {
      estimatedPrice *= 1.3; // Very ultralight packs
    }
  }

  if (weight_oz !== null && category === 'Sleep System') {
    if (weight_oz < 20) {
      estimatedPrice *= 1.3; // Very light sleeping bags/pads
    }
  }

  // Check for keywords that indicate premium/budget
  if (nameLower.includes('titanium') || nameLower.includes('ti ')) {
    estimatedPrice *= 1.3;
  }

  if (nameLower.includes('carbon') || nameLower.includes('cuben')) {
    estimatedPrice *= 1.4;
  }

  if (nameLower.includes('down') && category === 'Clothing') {
    estimatedPrice *= 1.3;
  }

  if (nameLower.includes('ultralight') || nameLower.includes('ul ')) {
    estimatedPrice *= 1.15;
  }

  // Keywords that indicate budget gear
  if (nameLower.includes('budget') || nameLower.includes('cheap') || nameLower.includes('basic')) {
    estimatedPrice *= 0.6;
  }

  // Ensure price stays within category range
  estimatedPrice = Math.max(priceRange.min, Math.min(priceRange.max, estimatedPrice));

  // Round to nearest $5
  return Math.round(estimatedPrice / 5) * 5;
}

/**
 * Estimate prices for an array of gear items
 * @param {Array} gearList - Array of gear items with name and category
 * @returns {Array} Gear list with estimated prices added
 */
function estimatePricesForGearList(gearList) {
  return gearList.map(item => {
    if (!item.price || item.price === 0) {
      const estimatedPrice = estimatePrice(item.name, item.category, item.weight_oz);
      return {
        ...item,
        price: estimatedPrice,
        priceEstimated: true
      };
    }
    return {
      ...item,
      priceEstimated: false
    };
  });
}

module.exports = {
  estimatePrice,
  estimatePricesForGearList
};
