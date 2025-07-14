import express from 'express';
import OtherProduct from '../models/OtherProduct.js';
import { getCategoryId, getCityId } from '../config/mlCategories.js';
import axios from 'axios';

const router = express.Router();

// Add Other Product
router.post('/', async (req, res) => {
  try {
    const {
      name,
      category,
      city,
      dateOfManufacturing,
      mrp,
      image,
      stock,
      brand,
      model,
      specifications,
      warranty,
      condition = 'new'
    } = req.body;

    // Get ML category and city IDs
    const categoryId = getCategoryId(category, 'other');
    const cityId = getCityId(city);

    const product = new OtherProduct({
      name,
      category,
      categoryId,
      listingDate: new Date(),
      dateOfManufacturing: new Date(dateOfManufacturing),
      mrp: parseFloat(mrp),
      city,
      cityId,
      image,
      stock: parseInt(stock),
      brand,
      model,
      specifications: specifications || {},
      warranty,
      condition,
      seller: req.body.seller || 'default@seller.com' // Replace with actual auth
    });

    // ML price prediction with enhanced data
    if (mrp && category) {
      try {
        const mlPayload = {
          categoryId: categoryId,
          cityId: cityId,
          mrp: parseFloat(mrp),
          listingDate: new Date().toISOString(),
          dateOfManufacturing: new Date(dateOfManufacturing).toISOString(),
          stock: parseInt(stock),
          productType: 'other',
          brand,
          model,
          condition,
          warranty,
          specifications: specifications || {}
        };

        // Only try ML API if URL is configured
        if (process.env.ML_API_URL) {
          const mlRes = await axios.post(process.env.ML_API_URL, mlPayload);
          product.bestPrice = mlRes.data.bestPrice || mrp;
          product.demandScore = mlRes.data.demandScore || 0;
          product.marketTrend = mlRes.data.marketTrend || 'stable';
        } else {
          // Fallback when ML API is not configured
          product.bestPrice = mrp;
          product.demandScore = 0;
          product.marketTrend = 'stable';
        }
      } catch (e) {
        console.log('ML API not available, using fallback pricing', e); // Print error
        product.bestPrice = mrp;
        product.demandScore = 0;
        product.marketTrend = 'stable';
      }
    }

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error adding other product:', err);
    res.status(400).json({ error: err.message });
  }
});

// List all Other Products
router.get('/', async (req, res) => {
  try {
    const products = await OtherProduct.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get products by seller
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const products = await OtherProduct.find({ seller: req.params.sellerId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update selling price with profit calculation
router.patch('/:id/price', async (req, res) => {
  try {
    const { sellingPrice } = req.body;
    const product = await OtherProduct.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const newSellingPrice = parseFloat(sellingPrice);
    const profit = newSellingPrice - product.mrp;
    const profitPercentage = ((profit / product.mrp) * 100).toFixed(2);
    
    const updatedProduct = await OtherProduct.findByIdAndUpdate(
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

// Get ML data for other products
router.get('/ml-data/:id', async (req, res) => {
  try {
    const product = await OtherProduct.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Format data for ML model
    const mlData = {
      productId: product._id,
      categoryId: product.categoryId,
      cityId: product.cityId,
      listingDate: product.listingDate,
      manufacturingDate: product.dateOfManufacturing,
      mrp: product.mrp,
      stock: product.stock,
      brand: product.brand,
      model: product.model,
      condition: product.condition,
      warranty: product.warranty,
      specifications: product.specifications,
      productType: 'other'
    };

    res.json(mlData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get best price prediction for other product
router.get('/:id/best-price', async (req, res) => {
  try {
    const product = await OtherProduct.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Simulate ML prediction (replace with actual ML API call)
    const currentPrice = product.sellingPrice || product.mrp;
    const predictedBestPrice = product.bestPrice || (product.mrp * 1.25); // 25% markup for electronics
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

// Update product (existing functionality)
router.patch('/:id', async (req, res) => {
  try {
    const update = req.body;
    
    // If category or city is updated, update the ML IDs
    if (update.category) {
      update.categoryId = getCategoryId(update.category, 'other');
    }
    if (update.city) {
      update.cityId = getCityId(update.city);
    }

    // If listingDate is updated, get new ML price
    if (update.listingDate) {
      try {
        const product = await OtherProduct.findById(req.params.id);
        const mlPayload = {
          categoryId: update.categoryId || product.categoryId,
          cityId: update.cityId || product.cityId,
          mrp: update.mrp || product.mrp,
          listingDate: new Date(update.listingDate).toISOString(),
          dateOfManufacturing: product.dateOfManufacturing.toISOString(),
          stock: update.stock || product.stock,
          productType: 'other',
          brand: update.brand || product.brand,
          model: update.model || product.model,
          condition: update.condition || product.condition,
          warranty: update.warranty || product.warranty,
          specifications: update.specifications || product.specifications
        };

        // Only try ML API if URL is configured
        if (process.env.ML_API_URL) {
          const mlRes = await axios.post(process.env.ML_API_URL, mlPayload);
          update.bestPrice = mlRes.data.bestPrice || product.mrp;
          update.demandScore = mlRes.data.demandScore || 0;
          update.marketTrend = mlRes.data.marketTrend || 'stable';
        } else {
          // Fallback when ML API is not configured
          update.bestPrice = product.mrp;
          update.demandScore = 0;
          update.marketTrend = 'stable';
        }
      } catch (e) {
        console.log('ML API not available, using fallback pricing');
        // fallback - keep existing bestPrice
      }
    }

    const product = await OtherProduct.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    await OtherProduct.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
