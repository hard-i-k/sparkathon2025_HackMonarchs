# Backend Setup Guide

## Overview
This backend provides ML-powered product management with automatic price predictions, category mapping, and enhanced data processing for both grocery and other products.

## Features
- ✅ ML Category Mapping (FOODS_1_001, HOUSEHOLD_1_001_budget, etc.)
- ✅ City Mapping (CA_1, TX_1, WI_1, etc.)
- ✅ Image Upload Support (Base64 encoding)
- ✅ Automatic Price Prediction via ML API
- ✅ Enhanced Product Models with ML fields
- ✅ RESTful API endpoints
- ✅ MongoDB Integration
- ✅ CORS Support
- ✅ Error Handling

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- ML API endpoint (optional, for price predictions)

## Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the backend directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/sparkthon-shop
# or for cloud: mongodb+srv://username:password@cluster.mongodb.net/sparkthon-shop

# Server Configuration
PORT=5000
NODE_ENV=development

# ML API Configuration (Optional)
ML_API_URL=http://localhost:8000/predict
# or your ML service endpoint

# JWT Secret (for future auth)
JWT_SECRET=your-secret-key-here

# File Upload Limits
MAX_FILE_SIZE=5242880
```

### 3. MongoDB Setup
#### Local MongoDB
```bash
# Install MongoDB locally
# Start MongoDB service
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Cloud MongoDB (MongoDB Atlas)
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster
3. Get connection string
4. Add to MONGODB_URI in .env

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Product Management

#### Grocery Products
- `POST /api/products/grocery` - Add grocery product
- `GET /api/products/grocery` - List all grocery products
- `GET /api/products/grocery/seller/:sellerId` - Get products by seller
- `PATCH /api/products/grocery/:id/price` - Update selling price
- `PATCH /api/products/grocery/:id` - Update product
- `DELETE /api/products/grocery/:id` - Delete product

#### Other Products
- `POST /api/products/other` - Add other product
- `GET /api/products/other` - List all other products
- `GET /api/products/other/seller/:sellerId` - Get products by seller
- `PATCH /api/products/other/:id` - Update product
- `DELETE /api/products/other/:id` - Delete product

### Configuration
- `GET /api/config/grocery-categories` - Get grocery categories
- `GET /api/config/other-categories` - Get other product categories
- `GET /api/config/cities` - Get cities
- `GET /api/config/all` - Get all configuration

## ML Integration

### Category Mappings

#### Grocery Categories
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

#### Other Product Categories
```javascript
{
  "Budget Laptop": "HOUSEHOLD_1_001_budget",
  "Mid-range Laptop": "HOUSEHOLD_1_002_mid-range",
  "Premium Laptop": "HOUSEHOLD_1_003_premium",
  // ... more categories
}
```

#### City Mappings
```javascript
{
  "California 1": "CA_1",
  "California 2": "CA_2",
  "Texas 1": "TX_1",
  "Texas 2": "TX_2",
  "Wisconsin 1": "WI_1",
  "Wisconsin 2": "WI_2"
}
```

### ML API Integration
The backend automatically calls your ML API for price predictions:

```javascript
// ML Payload Example
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

## Data Models

### GroceryProduct Schema
```javascript
{
  brandName: String,
  category: String,
  categoryId: String, // ML category ID
  dateAdded: Date,
  city: String,
  cityId: String, // ML city ID
  dateOfManufacturing: Date,
  mrp: Number,
  image: String, // Base64 or URL
  stock: Number,
  bestPrice: Number, // ML predicted price
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

### OtherProduct Schema
```javascript
{
  name: String,
  category: String,
  categoryId: String, // ML category ID
  listingDate: Date,
  dateOfManufacturing: Date,
  mrp: Number,
  city: String,
  cityId: String, // ML city ID
  image: String, // Base64 or URL
  stock: Number,
  bestPrice: Number, // ML predicted price
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

## Image Upload
- Supports file upload from user devices
- Converts to Base64 for storage
- 5MB file size limit
- Supported formats: PNG, JPG, GIF

## Error Handling
- Comprehensive error responses
- Validation for required fields
- ML API fallback handling
- Database connection error handling

## Development

### Running Tests
```bash
npm test
```

### Code Linting
```bash
npm run lint
```

### Database Seeding
```bash
# Add sample data
npm run seed
```

## Production Deployment

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

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MONGODB_URI in .env
   - Ensure MongoDB is running
   - Check network connectivity

2. **ML API Errors**
   - Verify ML_API_URL in .env
   - Check ML service availability
   - Review API payload format

3. **Image Upload Issues**
   - Check file size (max 5MB)
   - Verify file format
   - Check disk space

4. **CORS Errors**
   - Verify frontend URL in CORS configuration
   - Check browser console for errors

### Logs
```bash
# View application logs
pm2 logs sparkthon-backend

# View MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

## Support
For issues or questions:
1. Check the troubleshooting section
2. Review error logs
3. Verify environment configuration
4. Test API endpoints with Postman

## License
This project is part of the Sparkthon Voice Note application. 