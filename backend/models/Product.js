const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat & Seafood', 'Beverages', 'Snacks', 'Pantry'],
  },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, default: 0, min: 0 },
  unit: { type: String, default: 'kg', enum: ['kg', 'g', 'l', 'ml', 'pcs', 'pack', 'dozen'] },
  emoji: { type: String, default: '🛒' },
  description: { type: String },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
