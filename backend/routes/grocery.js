import express from 'express';
import GroceryProduct from '../models/GroceryProduct.js';
import { getCategoryId, getCityId } from '../config/mlCategories.js';
import axios from 'axios';

const router = express.Router();

// Add Grocery Product
router.post('/', async (req, res) => {
  try {
    const {
      brandName,
      category,
      city,
      dateOfManufacturing,
      mrp,
      image,
      stock,
      weight,
      unit = 'grams',
      expiryDate
    } = req.body;

    // Get ML category and city IDs
    const categoryId = getCategoryId(category, 'grocery');
    const cityId = getCityId(city);

    // Calculate expiry date if not provided (default 7 days for perishables)
    const calculatedExpiryDate = expiryDate ? new Date(expiryDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const product = new GroceryProduct({
      brandName,
      category,
      categoryId,
      dateAdded: new Date(),
      city,
      cityId,
      dateOfManufacturing: new Date(dateOfManufacturing),
      mrp: parseFloat(mrp),
      image,
      stock: parseInt(stock),
      weight: weight ? parseFloat(weight) : null,
      unit,
      expiryDate: calculatedExpiryDate,
      seller: req.body.seller || 'default@seller.com' // Replace with actual auth
    });

    // ML price prediction with enhanced data
    if (mrp && category) {
      try {
        const mlPayload = {
          categoryId: categoryId,
          cityId: cityId,
          mrp: parseFloat(mrp),
          dateAdded: new Date().toISOString(),
          expiryDate: calculatedExpiryDate.toISOString(),
          weight: weight ? parseFloat(weight) : null,
          stock: parseInt(stock),
          productType: 'grocery',
          brandName,
          unit
        };

        // Only try ML API if URL is configured
        if (process.env.ML_API_URL) {
          const mlRes = await axios.post(process.env.ML_API_URL, mlPayload);
          product.bestPrice = mlRes.data.bestPrice || mrp;
          product.demandScore = mlRes.data.demandScore || 0;
          product.seasonality = mlRes.data.seasonality || 'year-round';
        } else {
          // Fallback when ML API is not configured
          product.bestPrice = mrp;
          product.demandScore = 0;
          product.seasonality = 'year-round';
        }
      } catch (e) {
        console.log('ML API not available, using fallback pricing', e); // Print error
        product.bestPrice = mrp;
        product.demandScore = 0;
        product.seasonality = 'year-round';
      }
    }

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error adding grocery product:', err);
    res.status(400).json({ error: err.message });
  }
});

// List all Grocery Products
router.get('/', async (req, res) => {
  try {
    const products = await GroceryProduct.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get products by seller
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const products = await GroceryProduct.find({ seller: req.params.sellerId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update selling price with profit calculation
router.patch('/:id/price', async (req, res) => {
  try {
    const { sellingPrice } = req.body;
    const product = await GroceryProduct.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const newSellingPrice = parseFloat(sellingPrice);
    const profit = newSellingPrice - product.mrp;
    const profitPercentage = ((profit / product.mrp) * 100).toFixed(2);
    
    const updatedProduct = await GroceryProduct.findByIdAndUpdate(
      req.params.id, 
      { 
        sellingPrice: newSellingPrice,
        profit: profit,
        profitPercentage: profitPercentage
      }, 
      { new: true }
    );
    
    res.json({
      ...updatedProduct.toObject(),
      profit,
      profitPercentage
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get ML data for grocery products
router.get('/ml-data/:id', async (req, res) => {
  try {
    const product = await GroceryProduct.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Format data for ML model
    const mlData = {
      productId: product._id,
      categoryId: product.categoryId,
      cityId: product.cityId,
      listingDate: product.dateAdded,
      manufacturingDate: product.dateOfManufacturing,
      mrp: product.mrp,
      expiryDate: product.expiryDate,
      weight: product.weight,
      unit: product.unit,
      stock: product.stock,
      brandName: product.brandName,
      productType: 'grocery'
    };

    res.json(mlData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get best price prediction for grocery product
router.get('/:id/best-price', async (req, res) => {
  try {
    const product = await GroceryProduct.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Simulate ML prediction (replace with actual ML API call)
    const currentPrice = product.sellingPrice || product.mrp;
    const predictedBestPrice = product.bestPrice || (product.mrp * 1.15); // 15% markup
    const potentialProfit = predictedBestPrice - product.mrp;
    const potentialProfitPercentage = ((potentialProfit / product.mrp) * 100).toFixed(2);
    
    res.json({
      currentPrice,
      predictedBestPrice,
      potentialProfit,
      potentialProfitPercentage,
      mrp: product.mrp
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update product
router.patch('/:id', async (req, res) => {
  try {
    const update = req.body;
    
    // If category or city is updated, update the ML IDs
    if (update.category) {
      update.categoryId = getCategoryId(update.category, 'grocery');
    }
    if (update.city) {
      update.cityId = getCityId(update.city);
    }

    const product = await GroceryProduct.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    await GroceryProduct.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
