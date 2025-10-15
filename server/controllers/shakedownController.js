const GearItem = require('../models/GearItem');

// @desc    Create a new shakedown with gear list
// @route   POST /api/shakedown
// @access  Public
exports.createShakedown = async (req, res) => {
  try {
    const { gearList } = req.body;

    // Validate that gearList exists and is an array
    if (!gearList || !Array.isArray(gearList)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid gear list array'
      });
    }

    // Validate that gearList is not empty
    if (gearList.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Gear list cannot be empty'
      });
    }

    // Validate each gear item
    const validationErrors = [];
    gearList.forEach((item, index) => {
      if (!item.name) {
        validationErrors.push(`Item ${index + 1}: name is required`);
      }
      if (!item.category) {
        validationErrors.push(`Item ${index + 1}: category is required`);
      }
      if (item.weight_oz === undefined || item.weight_oz === null) {
        validationErrors.push(`Item ${index + 1}: weight_oz is required`);
      }
      if (item.weight_oz < 0) {
        validationErrors.push(`Item ${index + 1}: weight_oz cannot be negative`);
      }
      if (item.price < 0) {
        validationErrors.push(`Item ${index + 1}: price cannot be negative`);
      }
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: validationErrors
      });
    }


    // Normalize gear categories for imported/misc items
    const normalizeCategory = (cat, name) => {
      if (!cat) return 'Misc';
      const lower = cat.toLowerCase();
      const n = name ? name.toLowerCase() : '';
      // Big Three mapping
      if (lower.includes('big three')) {
        if (n.includes('backpack')) return 'Backpack';
        // Sleeping pad keywords (pads, mattress, and common pad product names)
        if (n.includes('sleeping pad') || n.includes(' pad') || n.includes('neoair') || n.includes('tensor') || n.includes('z-lite') || n.includes('zlite') || n.includes('q-core') || n.includes('qcore') || n.includes('mat ') || n.includes('mattress')) return 'Sleeping Pad';
        // Sleeping bag/quilt keywords
        if (n.includes('sleeping bag') || n.includes('quilt') || n.includes('liner') || n.includes('revelation') || n.includes('enigma') || n.includes('spark')) return 'Sleeping Bag';
        if (n.includes('tent')) return 'Shelter';
        if (n.includes('hammock')) return 'Shelter';
        if (n.includes('fly')) return 'Shelter';
        if (n.includes('stakes')) return 'Shelter';
        if (n.includes('straps')) return 'Shelter';
        return 'Misc';
      }
      // Cooking & Water mapping
      if (lower.includes('cooking') || lower.includes('water')) {
        if (n.includes('stove')) return 'Cooking';
        if (n.includes('cup')) return 'Cooking';
        if (n.includes('spork')) return 'Cooking';
        if (n.includes('pot')) return 'Cooking';
        if (n.includes('cozy')) return 'Cooking';
        if (n.includes('bottle')) return 'Water';
        if (n.includes('filtration')) return 'Water';
        if (n.includes('platypus')) return 'Water';
        if (n.includes('syringe')) return 'Water';
        if (n.includes('mesh bag')) return 'Water';
        if (n.includes('cap')) return 'Water';
        if (n.includes('bear')) return 'Misc';
        return 'Cooking';
      }
      // Health & First Aid mapping
      if (lower.includes('health') || lower.includes('first aid')) {
        return 'First Aid';
      }
      // Electronics mapping
      if (lower.includes('electr')) return 'Electronics';
      if (n.includes('power bank')) return 'Electronics';
      if (n.includes('headlamp')) return 'Electronics';
      if (n.includes('gps')) return 'Electronics';
      if (n.includes('charging')) return 'Electronics';
      if (n.includes('usb')) return 'Electronics';
      if (n.includes('cable')) return 'Electronics';
      if (n.includes('ear buds')) return 'Electronics';
      // Clothing mapping
      if (lower.includes('cloth')) return 'Clothing';
      if (n.includes('jacket')) return 'Clothing';
      if (n.includes('gloves')) return 'Clothing';
      if (n.includes('headband')) return 'Clothing';
      if (n.includes('shirt')) return 'Clothing';
      if (n.includes('pants')) return 'Clothing';
      if (n.includes('socks')) return 'Clothing';
      if (n.includes('underwear')) return 'Clothing';
      if (n.includes('gaiters')) return 'Clothing';
      if (n.includes('hat')) return 'Clothing';
      if (n.includes('boots')) return 'Clothing';
      if (n.includes('hoody')) return 'Clothing';
      if (n.includes('bra')) return 'Clothing';
      // Miscellaneous mapping
      if (lower.includes('misc')) return 'Misc';
      if (n.includes('journal')) return 'Misc';
      if (n.includes('pencil')) return 'Misc';
      if (n.includes('whistle')) return 'Misc';
      if (n.includes('bags')) return 'Misc';
      if (n.includes('trekking poles')) return 'Misc';
      // Fallbacks
      if (n.includes('tent')) return 'Shelter';
      if (n.includes('hammock')) return 'Shelter';
      if (n.includes('fly')) return 'Shelter';
      if (n.includes('stakes')) return 'Shelter';
      if (n.includes('straps')) return 'Shelter';
      if (n.includes('sleeping bag') || n.includes('quilt') || n.includes('liner') || n.includes('revelation') || n.includes('enigma') || n.includes('spark')) return 'Sleeping Bag';
      if (n.includes('sleeping pad') || n.includes(' pad') || n.includes('neoair') || n.includes('tensor') || n.includes('z-lite') || n.includes('zlite') || n.includes('q-core') || n.includes('qcore') || n.includes('mat ') || n.includes('mattress')) return 'Sleeping Pad';
      if (n.includes('backpack')) return 'Backpack';
      if (n.includes('stove')) return 'Cooking';
      if (n.includes('cup')) return 'Cooking';
      if (n.includes('spork')) return 'Cooking';
      if (n.includes('pot')) return 'Cooking';
      if (n.includes('cozy')) return 'Cooking';
      if (n.includes('bottle')) return 'Water';
      if (n.includes('filtration')) return 'Water';
      if (n.includes('platypus')) return 'Water';
      if (n.includes('syringe')) return 'Water';
      if (n.includes('mesh bag')) return 'Water';
      if (n.includes('cap')) return 'Water';
      if (n.includes('power bank')) return 'Electronics';
      if (n.includes('headlamp')) return 'Electronics';
      if (n.includes('gps')) return 'Electronics';
      if (n.includes('charging')) return 'Electronics';
      if (n.includes('usb')) return 'Electronics';
      if (n.includes('cable')) return 'Electronics';
      if (n.includes('ear buds')) return 'Electronics';
      if (n.includes('jacket')) return 'Clothing';
      if (n.includes('gloves')) return 'Clothing';
      if (n.includes('headband')) return 'Clothing';
      if (n.includes('shirt')) return 'Clothing';
      if (n.includes('pants')) return 'Clothing';
      if (n.includes('socks')) return 'Clothing';
      if (n.includes('underwear')) return 'Clothing';
      if (n.includes('gaiters')) return 'Clothing';
      if (n.includes('hat')) return 'Clothing';
      if (n.includes('boots')) return 'Clothing';
      if (n.includes('hoody')) return 'Clothing';
      if (n.includes('bra')) return 'Clothing';
      if (n.includes('journal')) return 'Misc';
      if (n.includes('pencil')) return 'Misc';
      if (n.includes('whistle')) return 'Misc';
      if (n.includes('bags')) return 'Misc';
      if (n.includes('trekking poles')) return 'Misc';
      return cat;
    };

    const normalizedGearList = gearList.map(item => ({
      ...item,
      category: normalizeCategory(item.category, item.name)
    }));

    // Calculate totals (skip MongoDB for MVP)
    const totalWeight = normalizedGearList.reduce((sum, item) => sum + item.weight_oz, 0);
    const totalPrice = normalizedGearList.reduce((sum, item) => sum + (item.price || 0), 0);

    // Generate recommendations using LLM and alternatives (optional)
    let llmSuggestions = [];
    try {
      const { fetchUltralightPosts, summarizeGearRecommendations } = require('../services/redditService');
      const redditPosts = await fetchUltralightPosts(10);
      const llmText = await summarizeGearRecommendations(redditPosts, normalizedGearList);
      // Parse LLM output into actionable suggestions (simple split for now)
      llmSuggestions = llmText.split('\n').filter(line => line.trim().length > 0);
    } catch (err) {
      console.error('LLM Reddit recommendations disabled (optional feature):', err.message);
      llmSuggestions = [];
    }

    // Generate standard recommendations
    let recommendations = generateRecommendations(normalizedGearList, totalWeight);

    // Only return recommendations based on user input and LLM suggestions
    res.status(201).json({
      success: true,
      data: {
        items: gearList,
        summary: {
          totalItems: gearList.length,
          totalWeightOz: Math.round(totalWeight),
          totalWeightLbs: (totalWeight / 16).toFixed(1),
          totalPrice: totalPrice.toFixed(2)
        },
        recommendations,
        llmSuggestions
      }
    });
  } catch (error) {
    console.error('Error creating shakedown:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Lightweight gear alternatives database
const gearAlternatives = {
  'Shelter': [
    { name: 'Zpacks Duplex', weight_oz: 19.4, price: 699, description: 'Ultralight 2-person tent', url: 'https://zpacks.com/products/duplex-tent' },
    { name: 'Gossamer Gear The One', weight_oz: 16.9, price: 295, description: 'Single-person ultralight tent', url: 'https://www.gossamergear.com/products/the-one' },
    { name: 'Six Moon Designs Lunar Solo', weight_oz: 26, price: 230, description: 'Popular solo tent', url: 'https://www.sixmoondesigns.com/products/lunar-solo' },
    { name: 'Sea to Summit Escapist Tarp', weight_oz: 10.5, price: 200, description: 'Ultralight tarp shelter', url: 'https://seatosummit.com/products/escapist-tarp/' }
  ],
  'Sleeping Bag': [
    { name: 'Enlightened Equipment Revelation 20°', weight_oz: 16.6, price: 325, description: 'Ultralight quilt', url: 'https://enlightenedequipment.com/revelation-quilt/' },
    { name: 'Sea to Summit Spark I', weight_oz: 12, price: 379, description: 'Ultralight sleeping bag', url: 'https://seatosummit.com/products/spark-sleeping-bag/' },
    { name: 'Enlightened Equipment Enigma 30°', weight_oz: 14, price: 285, description: 'Lightweight summer quilt', url: 'https://enlightenedequipment.com/enigma-quilt/' }
  ],
  'Sleeping Pad': [
    { name: 'Therm-a-Rest NeoAir XLite', weight_oz: 12, price: 200, description: 'Ultralight inflatable pad', url: 'https://www.thermarest.com/sleeping-pads/neoair-xlite-nxt-sleeping-pad/neoair-xlite-nxt.html' },
    { name: 'Nemo Tensor Insulated', weight_oz: 15, price: 200, description: 'Lightweight insulated pad', url: 'https://www.nemoequipment.com/products/tensor' },
    { name: 'Therm-a-Rest Z-Lite Sol', weight_oz: 10, price: 50, description: 'Foam sleeping pad', url: 'https://www.thermarest.com/sleeping-pads/closed-cell-foam/z-lite-sol-sleeping-pad/z-lite-sol.html' }
  ],
  'Backpack': [
    { name: 'Gossamer Gear Mariposa 60', weight_oz: 28, price: 325, description: 'Lightweight 60L pack', url: 'https://www.gossamergear.com/products/mariposa-60-backpack' },
    { name: 'ULA Circuit', weight_oz: 36, price: 265, description: 'Popular lightweight pack', url: 'https://www.ula-equipment.com/product/circuit/' },
    { name: 'Zpacks Arc Blast', weight_oz: 16.9, price: 375, description: 'Ultralight frameless pack', url: 'https://zpacks.com/products/arc-blast-backpack' },
    { name: 'Granite Gear Crown2 60', weight_oz: 38, price: 200, description: 'Budget lightweight pack', url: 'https://www.granitegear.com/crown2-60.html' },
    { name: 'Pa’lante V2', weight_oz: 16, price: 270, description: 'Minimalist ultralight pack', url: 'https://palantepacks.com/products/v2' }
  ],
  'Cooking': [
    { name: 'Toaks Titanium 550ml Pot', weight_oz: 2.4, price: 35, description: 'Ultralight titanium pot', url: 'https://www.toaksoutdoor.com/products/titanium-550ml-pot' },
    { name: 'MSR PocketRocket 2', weight_oz: 2.6, price: 50, description: 'Compact ultralight stove', url: 'https://www.msrgear.com/stoves/canister-stoves/pocketrocket-2-stove/09884.html' },
    { name: 'BRS-3000T Stove', weight_oz: 0.9, price: 20, description: 'Budget ultralight stove', url: 'https://brsstove.com/collections/stoves/products/brs-3000t' },
    { name: 'Cold soaking setup', weight_oz: 1.5, price: 10, description: 'No-cook food system', url: 'https://andrewskurka.com/cold-soaking-backpacking-meals-101/' },
    { name: 'Vargo Titanium Spork', weight_oz: 0.5, price: 10, description: 'Ultralight spork', url: 'https://www.vargooutdoors.com/titanium-spork.html' }
  ],
  'Water': [
    { name: 'Sawyer Squeeze', weight_oz: 3, price: 40, description: 'Lightweight filter', url: 'https://sawyer.com/products/squeeze-water-filtration-system' },
    { name: 'CNOC Vecto 2L', weight_oz: 2.2, price: 35, description: 'Ultralight water bag', url: 'https://cnocoutdoors.com/products/vecto-2l-water-container' },
    { name: 'Smartwater bottles (2x)', weight_oz: 1.5, price: 5, description: 'Budget ultralight bottles', url: 'https://www.smartwater.com/' },
    { name: 'Platypus Hoser 2L', weight_oz: 3.6, price: 35, description: 'Hydration reservoir', url: 'https://www.platy.com/hoser-2l' },
    { name: 'Katadyn BeFree Filter', weight_oz: 2, price: 45, description: 'Ultralight water filter', url: 'https://www.katadyn.com/us/us/149-8018006-katadyn-befree-1-0l' }
  ],
  'Clothing': [
    { name: 'Patagonia Houdini', weight_oz: 3.5, price: 99, description: 'Ultralight wind jacket', url: 'https://www.patagonia.com/product/mens-houdini-jacket/24142.html' },
    { name: 'Montbell Plasma 1000', weight_oz: 6.9, price: 379, description: 'Ultralight down jacket', url: 'https://en.montbell.jp/products/goods/list.php?category=1' },
    { name: 'Frogg Toggs jacket', weight_oz: 6, price: 20, description: 'Budget rain jacket', url: 'https://www.froggtoggs.com/' },
    { name: 'Enlightened Equipment Visp', weight_oz: 6.5, price: 200, description: 'Ultralight rain jacket', url: 'https://enlightenedequipment.com/visp-rain-jacket/' },
    { name: 'Merino wool base layers', weight_oz: 6, price: 80, description: 'Lightweight multi-day layers', url: 'https://www.icebreaker.com/en-us/mens-merino-wool-base-layers' },
    { name: 'Senchi Designs Alpha 90', weight_oz: 2.5, price: 90, description: 'Ultralight fleece', url: 'https://senchidesigns.com/products/alpha-90-hoodie' },
    { name: 'Darn Tough Socks', weight_oz: 2, price: 20, description: 'Durable lightweight socks', url: 'https://darntough.com/' }
  ],
  'Electronics': [
    { name: 'Nitecore NU25', weight_oz: 1.1, price: 40, description: 'Ultralight headlamp', url: 'https://flashlight.nitecore.com/product/nu25' },
    { name: 'Anker PowerCore 10000 PD', weight_oz: 6.8, price: 40, description: 'Lightweight battery pack', url: 'https://www.anker.com/products/a1235' },
    { name: 'Garmin inReach Mini', weight_oz: 3.5, price: 350, description: 'Satellite communicator', url: 'https://www.garmin.com/en-US/p/592726' }
  ],
  'First Aid': [
    { name: 'Ultralight first aid kit', weight_oz: 3, price: 25, description: 'Minimal essential supplies', url: 'https://www.trekker.com/ultralight-first-aid' },
    { name: 'Adventure Medical Ultralight', weight_oz: 5.6, price: 40, description: 'Pre-made ultralight kit', url: 'https://www.adventuremedicalkits.com/us_en/ultralight-watertight-5.html' },
    { name: 'Ziploc Quart Bag', weight_oz: 0.2, price: 1, description: 'Ultralight storage for first aid', url: 'https://www.ziploc.com/en/products/bags/storage-bags/quart-storage-bags' }
  ],
  'Misc': [
    { name: 'Deuce of Spades', weight_oz: 0.6, price: 20, description: 'Ultralight trowel', url: 'https://thetentlab.com/products/deuce-backcountry-trowel' },
    { name: 'Litesmith Mini Bic', weight_oz: 0.4, price: 5, description: 'Minimal lighter', url: 'https://litesmith.com/mini-bic-lighter/' },
    { name: 'Z-Lite Sol pad', weight_oz: 10, price: 50, description: 'Lightweight foam pad', url: 'https://www.thermarest.com/sleeping-pads/closed-cell-foam/z-lite-sol-sleeping-pad/z-lite-sol.html' },
    { name: 'Kula Cloth', weight_oz: 0.5, price: 20, description: 'Antimicrobial pee cloth', url: 'https://kulacloth.com/' }
  ]
};

// Helper function to generate recommendations
function generateRecommendations(gearList, totalWeight) {
  const highPriority = [];
  const mediumPriority = [];
  const lookingGood = [];

  // Weight class determination
  let weightClass = '';
  const totalLbs = totalWeight / 16;

  if (totalLbs < 10) {
    weightClass = 'Ultralight';
  } else if (totalLbs < 20) {
    weightClass = 'Lightweight';
  } else {
    weightClass = 'Traditional';
  }

  // Analyze each item and create swap recommendations
  const itemsWithSwaps = [];

  gearList.forEach(item => {
    const category = item.category;
    const alternatives = gearAlternatives[category] || [];
    // Compare every item in the user's list to all alternatives in the same category
    const lighterOptions = alternatives.filter(alt => alt.weight_oz < item.weight_oz);

    if (lighterOptions.length > 0) {
      // Always pick the best (lightest) alternative
      const bestAlternative = lighterOptions.sort((a, b) => a.weight_oz - b.weight_oz)[0];
      const savingsOz = item.weight_oz - bestAlternative.weight_oz;
      if (savingsOz >= 4) {
        itemsWithSwaps.push({
          item,
          alternative: bestAlternative,
          savingsOz,
          priority: savingsOz >= 12 ? 'high' : 'medium'
        });
      }
    }
  });

  // Sort by savings and create recommendations
  itemsWithSwaps.sort((a, b) => b.savingsOz - a.savingsOz);

  // High priority swaps (saves > 1 lb)
  itemsWithSwaps.filter(swap => swap.priority === 'high').forEach(swap => {
    const why = generateWhyText(swap.item, swap.alternative, swap.savingsOz);

    highPriority.push({
      type: 'swap',
      currentItem: {
        name: swap.item.name,
        brand: swap.item.brand || '',
        weight_oz: Math.round(swap.item.weight_oz),
        price: swap.item.price || 0
      },
      recommendedItem: {
        name: swap.alternative.name,
        weight_oz: swap.alternative.weight_oz,
        price: swap.alternative.price,
        description: swap.alternative.description,
        url: swap.alternative.url
      },
      savingsOz: Math.round(swap.savingsOz),
      why: why
    });
  });

  // Medium priority swaps
  itemsWithSwaps.filter(swap => swap.priority === 'medium').forEach(swap => {
    mediumPriority.push({
      type: 'optimize',
      category: swap.item.category,
      currentItem: swap.item.name,
      weight_oz: Math.round(swap.item.weight_oz),
      suggestion: `Consider ${swap.alternative.name} (${swap.alternative.weight_oz}oz, $${swap.alternative.price}) to save ${Math.round(swap.savingsOz)}oz.`,
      alternatives: [swap.alternative]
    });
  });

  // Looking Good section
  const positiveNotes = [];
  if (totalLbs < 15) {
    positiveNotes.push(`Your gear choices show you've done research. Main opportunities are in the "Big Three" (shelter, sleep, pack).`);
  }

  // Check for already optimized categories
  const lightCategories = [];
  gearList.forEach(item => {
    if (item.weight_oz < 20 && ['Shelter', 'Sleeping Bag', 'Sleeping Pad', 'Backpack'].includes(item.category)) {
      lightCategories.push(item.category);
    }
  });

  if (lightCategories.length > 0) {
    positiveNotes.push(`Your ${lightCategories.join(', ')} is already optimized.`);
  }

  if (positiveNotes.length > 0) {
    lookingGood.push({
      type: 'positive',
      message: positiveNotes.join(' ')
    });
  }

  // Calculate total potential savings
  const totalSavingsOz = itemsWithSwaps.reduce((sum, swap) => sum + swap.savingsOz, 0);
  const currentWeightOz = Math.round(totalWeight);
  const potentialWeightOz = currentWeightOz - Math.round(totalSavingsOz);

  // Always return the expected keys for client compatibility
  return {
    weightClass,
    currentWeight: {
      oz: currentWeightOz,
      lbs: totalLbs.toFixed(2)
    },
    potentialWeight: {
      oz: potentialWeightOz,
      lbs: (potentialWeightOz / 16).toFixed(2)
    },
    potentialSavings: {
      oz: Math.round(totalSavingsOz),
      lbs: (totalSavingsOz / 16).toFixed(2)
    },
    highPriority: Array.isArray(highPriority) ? highPriority : [],
    mediumPriority: Array.isArray(mediumPriority) ? mediumPriority : [],
    lookingGood: Array.isArray(lookingGood) ? lookingGood : []
  };
}

// Generate contextual "why" text for swaps
function generateWhyText(currentItem, alternative, savingsOz) {
  const category = currentItem.category;
  const savingsLbs = (savingsOz / 16).toFixed(1);

  const whyTexts = {
    'Shelter': `The ${alternative.name} will save you significant weight and is proven on long trails. Yes, it's pricier, but for a thru-hike the weight savings compound daily. ${currentItem.name} is great but overkill for solo + ultralight goals.`,
    'Sleeping Bag': `A quilt will save major weight. The ${alternative.name} is battle-tested on major trails. Since you're going in warmer months, consider the lighter version for even more savings.`,
    'Sleeping Pad': `The ${alternative.name} offers a great weight-to-comfort ratio. ${savingsLbs}lbs saved on your sleeping pad means easier carries and less fatigue over long days.`,
    'Backpack': `With lighter shelter and sleep system, you can drop to ${alternative.name}. This saves ${savingsLbs}lbs and your back will thank you after 20+ mile days.`,
    'Cooking': `The ${alternative.name} is ultralight and sufficient for most meals. Consider cold-soaking to eliminate cooking gear entirely.`,
    'Clothing': `${alternative.name} provides same protection at ${alternative.weight_oz}oz. Layer strategically instead of heavy single pieces.`,
  };

  return whyTexts[category] || `Switching to ${alternative.name} saves ${savingsLbs}lbs without sacrificing functionality.`;
}
