const mongoose = require('mongoose');

const gearItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Gear item name is required'],
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  weight_oz: {
    type: Number,
    required: [true, 'Weight in ounces is required'],
    min: [0, 'Weight cannot be negative']
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative']
  }
}, {
  timestamps: true
});

const GearItem = mongoose.model('GearItem', gearItemSchema);

module.exports = GearItem;
