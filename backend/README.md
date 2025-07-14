# Sparkthon Backend - ML-Powered Product Management

## 🚀 Features

### ✅ ML Integration
- **Category Mapping**: Automatic mapping to ML category IDs (FOODS_1_001, HOUSEHOLD_1_001_budget, etc.)
- **City Mapping**: Location mapping to ML city IDs (CA_1, TX_1, WI_1, etc.)
- **Price Prediction**: Automatic ML-powered price predictions
- **Demand Analysis**: Real-time demand scoring and market trends

### ✅ Product Management
- **Grocery Products**: Full CRUD with ML enhancements
- **Other Products**: Electronics, gadgets, and household items
- **Image Upload**: Base64 encoding with 5MB limit
- **Stock Management**: Real-time inventory tracking

### ✅ Enhanced Data Models
- **ML Fields**: categoryId, cityId, demandScore, seasonality
- **Product Details**: weight, unit, expiry date, warranty
- **Seller Management**: Multi-seller support
- **Price Tracking**: MRP, best price, selling price

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- ML API endpoint (optional)

## 🛠️ Quick Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create `.env` file:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/sparkthon-shop

# Server
PORT=5000
NODE_ENV=development

# ML API (Optional)
ML_API_URL=http://localhost:8000/predict

# Security
JWT_SECRET=your-secret-key

# Upload
MAX_FILE_SIZE=5242880
```

### 3. Start MongoDB
```bash
# Local
mongod

# Or Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Run Backend
```bash
# Development
npm run dev

# Production
npm start
```

## 🔗 API Endpoints

### Product Management
```
POST   /api/products/grocery          # Add grocery product
GET    /api/products/grocery          # List grocery products
PATCH  /api/products/grocery/:id      # Update grocery product
DELETE /api/products/grocery/:id      # Delete grocery product

POST   /api/products/other            # Add other product
GET    /api/products/other            # List other products
PATCH  /api/products/other/:id        # Update other product
DELETE /api/products/other/:id        # Delete other product
```

### Configuration
```
GET /api/config/grocery-categories    # Get grocery categories
GET /api/config/other-categories      # Get other categories
GET /api/config/cities               # Get cities
GET /api/config/all                  # Get all config
```

## 🧠 ML Category Mappings

### Grocery Categories
```javascript
{
  "Paneer": "FOODS_1_001",
  "Yogurt": "FOODS_1_002",
  "Cheese": "FOODS_1_003",
  "Butter": "FOODS_1_004",
  "Cake": "FOODS_2_001",
  "Bread": "FOODS_2_002",
  "Pastries": "FOODS_2_003",
  "Rolls": "FOODS_2_004",
  "Shrimp": "FOODS_3_001",
  "Salmon": "FOODS_3_002",
  "Fish": "FOODS_3_003",
  "Crab": "FOODS_3_004"
}
```

### Other Product Categories
```javascript
{
  "Budget Laptop": "HOUSEHOLD_1_001_budget",
  "Mid-range Laptop": "HOUSEHOLD_1_002_mid-range",
  "Premium Laptop": "HOUSEHOLD_1_003_premium",
  "Budget Tablet": "HOUSEHOLD_1_004_budget",
  "Mid-range Tablet": "HOUSEHOLD_1_005_mid-range",
  "Premium Tablet": "HOUSEHOLD_1_006_premium",
  "Budget Smartwatch": "HOUSEHOLD_1_007_budget",
  "Mid-range Smartwatch": "HOUSEHOLD_1_008_mid-range",
  "Premium Smartwatch": "HOUSEHOLD_1_009_premium",
  "Budget Smartphone": "HOUSEHOLD_2_001_budget",
  "Mid-range Smartphone": "HOUSEHOLD_2_002_mid-range",
  "Premium Smartphone": "HOUSEHOLD_2_003_premium",
  "Budget Headphones": "HOUSEHOLD_2_004_budget",
  "Mid-range Headphones": "HOUSEHOLD_2_005_mid-range",
  "Premium Headphones": "HOUSEHOLD_2_006_premium",
  "Budget Speaker": "HOUSEHOLD_2_007_budget",
  "Mid-range Speaker": "HOUSEHOLD_2_008_mid-range",
  "Premium Speaker": "HOUSEHOLD_2_009_premium"
}
```

### City Mappings
```javascript
{
  "California 1": "CA_1",
  "California 2": "CA_2",
  "California 3": "CA_3",
  "California 4": "CA_4",
  "Texas 1": "TX_1",
  "Texas 2": "TX_2",
  "Texas 3": "TX_3",
  "Wisconsin 1": "WI_1",
  "Wisconsin 2": "WI_2",
  "Wisconsin 3": "WI_3"
}
```

## 📊 Data Models

### GroceryProduct
```javascript
{
  brandName: String,
  category: String,
  categoryId: String,        // ML category ID
  dateAdded: Date,
  city: String,
  cityId: String,           // ML city ID
  dateOfManufacturing: Date,
  mrp: Number,
  image: String,            // Base64 or URL
  stock: Number,
  bestPrice: Number,        // ML predicted price
  seller: String,
  sellingPrice: Number,
  productType: String,
  expiryDate: Date,
  weight: Number,
  unit: String,
  demandScore: Number,
  seasonality: String,
  perishable: Boolean
}
```

### OtherProduct
```javascript
{
  name: String,
  category: String,
  categoryId: String,        // ML category ID
  listingDate: Date,
  dateOfManufacturing: Date,
  mrp: Number,
  city: String,
  cityId: String,           // ML city ID
  image: String,            // Base64 or URL
  stock: Number,
  bestPrice: Number,        // ML predicted price
  seller: String,
  sellingPrice: Number,
  productType: String,
  brand: String,
  model: String,
  specifications: Object,
  demandScore: Number,
  marketTrend: String,
  warranty: String,
  condition: String
}
```

## 🔄 ML API Integration

### Request Payload
```javascript
{
  "categoryId": "FOODS_1_001",
  "cityId": "CA_1",
  "mrp": 99.99,
  "dateAdded": "2024-01-15T10:30:00.000Z",
  "expiryDate": "2024-01-22T10:30:00.000Z",
  "weight": 500,
  "stock": 100,
  "productType": "grocery",
  "brandName": "Organic Brand",
  "unit": "grams"
}
```

### Response Format
```javascript
{
  "bestPrice": 89.99,
  "demandScore": 0.85,
  "seasonality": "year-round",
  "marketTrend": "stable"
}
```

## 🖼️ Image Upload

- **Supported Formats**: PNG, JPG, GIF
- **Size Limit**: 5MB
- **Storage**: Base64 encoding
- **Preview**: Real-time image preview

## 🚀 Production Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
ML_API_URL=your-production-ml-api-url
JWT_SECRET=your-production-secret
```

### PM2 Deployment
```bash
npm install -g pm2
pm2 start app.js --name "sparkthon-backend"
pm2 save
pm2 startup
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection**
   - Check MONGODB_URI in .env
   - Ensure MongoDB is running
   - Verify network connectivity

2. **ML API Errors**
   - Verify ML_API_URL in .env
   - Check ML service availability
   - Review API payload format

3. **Image Upload**
   - Check file size (max 5MB)
   - Verify file format
   - Check disk space

4. **CORS Errors**
   - Verify frontend URL
   - Check browser console

## 📝 Development

```bash
# Run tests
npm test

# Lint code
npm run lint

# Seed database
npm run seed
```

## 📄 License

This project is part of the Sparkthon Voice Note application.

---

**Ready to power your ML-driven product management! 🚀**
