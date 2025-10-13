// @desc    Generate gear list recommendations based on trip profile
// @route   POST /api/recommendations
// @access  Public
exports.generateGearRecommendations = async (req, res) => {
  try {
    const {
      tripType,       // 'weekend', '1-week', '2+weeks'
      season,         // 'spring', 'summer', 'fall', 'winter'
      terrain,        // 'easy', 'moderate', 'difficult'
      experience,     // 'beginner', 'intermediate', 'expert'
      budget          // 'budget', 'mid-range', 'premium'
    } = req.body;

    // Validate required fields
    if (!tripType || !season || !terrain || !experience || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Please provide trip type, season, terrain, experience level, and budget'
      });
    }

    // Generate recommended gear list based on profile
    const recommendedGear = buildGearList(tripType, season, terrain, experience, budget);

    // Calculate totals
    const totalWeight = recommendedGear.reduce((sum, item) => sum + item.weight_oz, 0);
    const totalPrice = recommendedGear.reduce((sum, item) => sum + item.price, 0);

    res.status(200).json({
      success: true,
      data: {
        profile: {
          tripType,
          season,
          terrain,
          experience,
          budget
        },
        gearList: recommendedGear,
        summary: {
          totalItems: recommendedGear.length,
          totalWeightOz: Math.round(totalWeight),
          totalWeightLbs: (totalWeight / 16).toFixed(1),
          totalPrice: totalPrice.toFixed(2)
        }
      }
    });
  } catch (error) {
    console.error('Error generating gear recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Helper function to build gear list based on profile
function buildGearList(tripType, season, terrain, experience, budget) {
  const gearList = [];

  // Define gear databases by budget category
  const shelterOptions = {
    budget: [
      { name: 'Lanshan 2 Tent', weight_oz: 42, price: 120, category: 'Shelter' },
      { name: 'Paria Breeze Mesh Tent', weight_oz: 32, price: 140, category: 'Shelter' }
    ],
    'mid-range': [
      { name: 'Gossamer Gear The One', weight_oz: 16.9, price: 295, category: 'Shelter' },
      { name: 'Tarptent Double Rainbow', weight_oz: 42, price: 379, category: 'Shelter' }
    ],
    premium: [
      { name: 'Zpacks Duplex', weight_oz: 19.4, price: 699, category: 'Shelter' },
      { name: 'Big Agnes Fly Creek HV UL2', weight_oz: 28, price: 450, category: 'Shelter' }
    ]
  };

  const sleepOptions = {
    budget: [
      { name: 'Hyke & Byke Sleeping Bag', weight_oz: 32, price: 150, category: 'Sleep System' },
      { name: 'Klymit Static V Pad', weight_oz: 18, price: 50, category: 'Sleep System' }
    ],
    'mid-range': [
      { name: 'Enlightened Equipment Revelation 30°', weight_oz: 18, price: 285, category: 'Sleep System' },
      { name: 'Therm-a-Rest NeoAir XLite', weight_oz: 12, price: 200, category: 'Sleep System' }
    ],
    premium: [
      { name: 'Western Mountaineering UltraLite 20°', weight_oz: 25, price: 575, category: 'Sleep System' },
      { name: 'Nemo Tensor Insulated', weight_oz: 15, price: 200, category: 'Sleep System' }
    ]
  };

  const backpackOptions = {
    budget: [
      { name: 'Granite Gear Crown2 60', weight_oz: 38, price: 200, category: 'Backpack' }
    ],
    'mid-range': [
      { name: 'Gossamer Gear Mariposa 60', weight_oz: 28, price: 325, category: 'Backpack' },
      { name: 'ULA Circuit', weight_oz: 36, price: 265, category: 'Backpack' }
    ],
    premium: [
      { name: 'Zpacks Arc Blast', weight_oz: 16.9, price: 375, category: 'Backpack' },
      { name: 'Hyperlite Mountain Gear 3400', weight_oz: 28, price: 365, category: 'Backpack' }
    ]
  };

  const cookingOptions = {
    budget: [
      { name: 'BRS-3000T Stove', weight_oz: 0.9, price: 20, category: 'Cooking' },
      { name: 'Imusa 12cm Pot', weight_oz: 5, price: 12, category: 'Cooking' }
    ],
    'mid-range': [
      { name: 'MSR PocketRocket 2', weight_oz: 2.6, price: 50, category: 'Cooking' },
      { name: 'Toaks Titanium 550ml Pot', weight_oz: 2.4, price: 35, category: 'Cooking' }
    ],
    premium: [
      { name: 'Soto Windmaster', weight_oz: 3, price: 70, category: 'Cooking' },
      { name: 'Toaks Titanium 750ml Pot', weight_oz: 3.4, price: 45, category: 'Cooking' }
    ]
  };

  const waterOptions = {
    budget: [
      { name: 'Sawyer Mini', weight_oz: 2, price: 25, category: 'Water' },
      { name: 'Smartwater Bottles (2x 1L)', weight_oz: 1.5, price: 5, category: 'Water' }
    ],
    'mid-range': [
      { name: 'Sawyer Squeeze', weight_oz: 3, price: 40, category: 'Water' },
      { name: 'CNOC Vecto 2L', weight_oz: 2.2, price: 35, category: 'Water' }
    ],
    premium: [
      { name: 'Katadyn BeFree 1L', weight_oz: 2.3, price: 45, category: 'Water' },
      { name: 'Platypus Hoser 2L', weight_oz: 3.6, price: 35, category: 'Water' }
    ]
  };

  const clothingOptions = {
    budget: [
      { name: 'Frogg Toggs Rain Jacket', weight_oz: 6, price: 20, category: 'Clothing' },
      { name: 'Decathlon Puffy Jacket', weight_oz: 12, price: 60, category: 'Clothing' }
    ],
    'mid-range': [
      { name: 'Patagonia Houdini', weight_oz: 3.5, price: 99, category: 'Clothing' },
      { name: 'Outdoor Research Helium Down Hoodie', weight_oz: 10.6, price: 269, category: 'Clothing' }
    ],
    premium: [
      { name: 'Montbell Plasma 1000', weight_oz: 6.9, price: 379, category: 'Clothing' },
      { name: 'Arc\'teryx Squamish Hoody', weight_oz: 5.4, price: 140, category: 'Clothing' }
    ]
  };

  const electronicsOptions = {
    budget: [
      { name: 'Generic Headlamp', weight_oz: 2, price: 15, category: 'Electronics' },
      { name: 'Anker PowerCore 10000', weight_oz: 6.4, price: 30, category: 'Electronics' }
    ],
    'mid-range': [
      { name: 'Nitecore NU25', weight_oz: 1.1, price: 40, category: 'Electronics' },
      { name: 'Anker PowerCore 10000 PD', weight_oz: 6.8, price: 40, category: 'Electronics' }
    ],
    premium: [
      { name: 'Petzl Bindi', weight_oz: 1.2, price: 50, category: 'Electronics' },
      { name: 'Nitecore NB10000', weight_oz: 5.3, price: 50, category: 'Electronics' }
    ]
  };

  const firstAidOptions = {
    budget: [
      { name: 'Basic First Aid Kit', weight_oz: 5, price: 20, category: 'First Aid' }
    ],
    'mid-range': [
      { name: 'Adventure Medical Ultralight', weight_oz: 5.6, price: 40, category: 'First Aid' }
    ],
    premium: [
      { name: 'Custom Ultralight First Aid', weight_oz: 3, price: 50, category: 'First Aid' }
    ]
  };

  const miscOptions = {
    budget: [
      { name: 'Plastic Trowel', weight_oz: 1.2, price: 8, category: 'Misc' },
      { name: 'Regular Lighter', weight_oz: 0.6, price: 2, category: 'Misc' }
    ],
    'mid-range': [
      { name: 'Deuce of Spades', weight_oz: 0.6, price: 20, category: 'Misc' },
      { name: 'Litesmith Mini Bic', weight_oz: 0.4, price: 5, category: 'Misc' }
    ],
    premium: [
      { name: 'Ti Goat Ti Trowel', weight_oz: 0.3, price: 35, category: 'Misc' },
      { name: 'Litesmith Mini Bic', weight_oz: 0.4, price: 5, category: 'Misc' }
    ]
  };

  // Select gear based on budget
  gearList.push(...shelterOptions[budget]);
  gearList.push(...sleepOptions[budget]);
  gearList.push(backpackOptions[budget][0]);

  // Add cooking gear (optional for experienced hikers in summer)
  if (!(experience === 'expert' && season === 'summer')) {
    gearList.push(...cookingOptions[budget]);
  }

  gearList.push(...waterOptions[budget]);

  // Add more clothing for winter/difficult terrain
  if (season === 'winter' || terrain === 'difficult') {
    gearList.push(...clothingOptions[budget]);
    // Add extra insulation for winter
    if (season === 'winter') {
      const winterGear = {
        budget: { name: 'Down Mittens', weight_oz: 4, price: 30, category: 'Clothing' },
        'mid-range': { name: 'Montbell Down Mittens', weight_oz: 2.5, price: 60, category: 'Clothing' },
        premium: { name: 'Feathered Friends Down Mittens', weight_oz: 2, price: 90, category: 'Clothing' }
      };
      gearList.push(winterGear[budget]);
    }
  } else {
    // Just rain jacket for other seasons
    gearList.push(clothingOptions[budget][0]);
  }

  gearList.push(...electronicsOptions[budget]);
  gearList.push(firstAidOptions[budget][0]);
  gearList.push(...miscOptions[budget]);

  return gearList;
}
