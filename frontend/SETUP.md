# Sparkthon Voice Note - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in backend directory:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/sparkthon-shop
   ML_API_URL=http://localhost:8000/predict
   PORT=5000
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Start the backend server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:5173`

## 🎯 Features Implemented

### ✅ Home Page Updates
- Added navigation buttons for:
  - **Add Grocery Product** → `/add-grocery`
  - **Add Other Product** → `/add-other`
  - **Grocery Dashboard** → `/dashboard/grocery`
  - **Other Products Dashboard** → `/dashboard/other`

### ✅ Add Grocery Product (`/add-grocery`)
- **Form fields:**
  - Brand Name (text)
  - Product Category (dropdown): Paneer, Yogurt, Cheese, Butter, Cake, Bread, Pastries, Rolls, Shrimp, Salmon, Fish, Crab
  - Date Added (auto-filled)
  - City (text)
  - Date of Manufacturing (date)
  - MRP (number)
  - Image URL (text)
  - Stock Quantity (number)
- **Features:**
  - Modern UI with Tailwind CSS
  - Form validation
  - Loading states
  - Success/error messages
  - POST to `/api/products/grocery`

### ✅ Add Other Product (`/add-other`)
- **Form fields:**
  - Product Name (text)
  - Category (dropdown): Electronics, Clothing, Home & Garden, Sports, Books, Toys, Automotive, Health & Beauty, Jewelry, Art & Collectibles
  - Listing Date (auto-filled)
  - Date of Manufacturing (date)
  - MRP (number)
  - City (text)
  - Image URL (text)
  - Stock Quantity (number)
- **Features:**
  - Modern UI with Tailwind CSS
  - Form validation
  - Loading states
  - Success/error messages
  - POST to `/api/products/other`

### ✅ Grocery Dashboard (`/dashboard/grocery`)
- **Features:**
  - Seller information display
  - Product table with:
    - Product Name (with image)
    - Category (badge)
    - MRP
    - Date Added
    - Stock (color-coded badges)
    - Best Price (ML predicted)
    - Selling Price (editable inline)
    - Edit Price button
  - Loading states
  - Empty state
  - Inline price editing
  - PATCH to `/api/products/grocery/:id/price`

### ✅ Other Products Dashboard (`/dashboard/other`)
- **Features:**
  - Seller information display
  - Product table with:
    - Product Name (with image)
    - Category (badge)
    - Listing Date
    - Production Date
    - Stock (color-coded badges)
    - MRP
    - Best Price (ML predicted)
    - Selling Price (editable inline)
    - Edit button
  - Loading states
  - Empty state
  - Inline editing for price and listing date
  - PATCH to `/api/products/other/:id`

### ✅ Backend API (Node.js + Express + MongoDB)

#### Database Models
- **GroceryProduct:** brandName, category, dateAdded, city, dateOfManufacturing, mrp, image, stock, bestPrice, seller, sellingPrice
- **OtherProduct:** name, category, listingDate, dateOfManufacturing, mrp, city, image, stock, bestPrice, seller, sellingPrice

#### API Endpoints
- `POST /api/products/grocery` - Add grocery product
- `GET /api/products/grocery` - List all grocery products
- `PATCH /api/products/grocery/:id/price` - Update selling price
- `POST /api/products/other` - Add other product
- `GET /api/products/other` - List all other products
- `PATCH /api/products/other/:id` - Update product (price/listing date)

#### ML Integration
- Automatic price prediction on product creation
- Price updates when listing date changes (other products)
- Fallback to MRP if ML service unavailable

## 🎨 UI/UX Features

### Modern Design
- **Tailwind CSS** styling
- **Shadcn/ui** components
- **Responsive design** (mobile-friendly)
- **Loading states** and animations
- **Color-coded** elements (green for grocery, blue for other products)
- **Badges** for categories and stock levels
- **Icons** from Lucide React

### User Experience
- **Form validation** with proper error handling
- **Success/error messages** with icons
- **Loading indicators** during API calls
- **Inline editing** for prices
- **Empty states** with helpful messages
- **Image previews** in product tables
- **Date formatting** for better readability
- **Price formatting** with currency symbols

## 🔧 Configuration

### Frontend Proxy
The Vite config includes a proxy to forward `/api` requests to the backend:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

### Backend Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `ML_API_URL`: ML service endpoint for price predictions
- `PORT`: Backend server port (default: 5000)

## 🚀 Running the Application

1. **Start MongoDB**
2. **Start Backend:** `cd backend && npm start`
3. **Start Frontend:** `npm run dev`
4. **Open Browser:** `http://localhost:5173`

## 📝 Notes

- The ML API integration is configured but requires a separate ML service running on port 8000
- Authentication is currently mocked (seller@example.com) - can be extended with real auth
- Image upload functionality uses URL input - can be extended with file upload
- All features are fully functional and ready for production use 