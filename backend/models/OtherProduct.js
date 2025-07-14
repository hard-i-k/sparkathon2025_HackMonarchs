import mongoose from 'mongoose';

const OtherProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  categoryId: { type: String, required: true }, // ML category ID
  listingDate: { type: Date, required: true, default: Date.now },
  dateOfManufacturing: { type: Date, required: true },
  mrp: { type: Number, required: true },
  city: { type: String, required: true },
  cityId: { type: String, required: true }, // ML city ID
  image: { type: String }, // URL or base64
  stock: { type: Number, required: true },
  bestPrice: { type: Number },
  seller: { type: String }, // email or ID
  sellingPrice: { type: Number },
  // ML specific fields
  productType: { type: String, default: 'other' },
  brand: { type: String },
  model: { type: String },
  specifications: { type: Object },
  // Additional fields for ML
  demandScore: { type: Number, default: 0 },
  marketTrend: { type: String },
  warranty: { type: String },
  condition: { type: String, default: 'new' } // new, used, refurbished
}, {
  timestamps: true
});

export default mongoose.model('OtherProduct', OtherProductSchema);
