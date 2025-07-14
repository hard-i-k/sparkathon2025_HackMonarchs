import express from 'express';
import { 
  getGroceryCategories, 
  getOtherCategories, 
  getCities,
  GROCERY_CATEGORIES,
  OTHER_CATEGORIES,
  CITY_MAPPINGS
} from '../config/mlCategories.js';

const router = express.Router();

// Get grocery categories
router.get('/grocery-categories', (req, res) => {
  try {
    const categories = getGroceryCategories();
    res.json({
      categories,
      mappings: GROCERY_CATEGORIES
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get other product categories
router.get('/other-categories', (req, res) => {
  try {
    const categories = getOtherCategories();
    res.json({
      categories,
      mappings: OTHER_CATEGORIES
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get cities
router.get('/cities', (req, res) => {
  try {
    const cities = getCities();
    res.json({
      cities,
      mappings: CITY_MAPPINGS
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all configuration
router.get('/all', (req, res) => {
  try {
    res.json({
      groceryCategories: {
        categories: getGroceryCategories(),
        mappings: GROCERY_CATEGORIES
      },
      otherCategories: {
        categories: getOtherCategories(),
        mappings: OTHER_CATEGORIES
      },
      cities: {
        cities: getCities(),
        mappings: CITY_MAPPINGS
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router; 