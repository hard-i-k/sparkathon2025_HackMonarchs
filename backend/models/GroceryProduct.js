import mongoose from 'mongoose';

const GroceryProductSchema = new mongoose.Schema({
  brandName: { type: String, required: true },
  category: { type: String, required: true },
  categoryId: { type: String, required: true }, // ML category ID
  dateAdded: { type: Date, required: true, default: Date.now },
  city: { type: String, required: true },
  cityId: { type: String, required: true }, // ML city ID
  dateOfManufacturing: { type: Date, required: true },
  mrp: { type: Number, required: true },
  image: { type: String }, // URL or base64
  stock: { type: Number, required: true },
  bestPrice: { type: Number },
  seller: { type: String }, // email or ID
  sellingPrice: { type: Number },
  // ML specific fields
  productType: { type: String, default: 'grocery' },
  expiryDate: { type: Date },
  weight: { type: Number }, // in grams
  unit: { type: String, default: 'grams' },
  // Additional fields for ML
  demandScore: { type: Number, default: 0 },
  seasonality: { type: String },
  perishable: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model('GroceryProduct', GroceryProductSchema);
