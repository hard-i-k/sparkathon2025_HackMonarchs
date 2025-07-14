// ML Category Mappings for Grocery Products
export const GROCERY_CATEGORIES = {
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
};

// ML Category Mappings for Other Products
export const OTHER_CATEGORIES = {
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
};

// City Mappings for ML
export const CITY_MAPPINGS = {
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
};

// Helper function to get category ID
export const getCategoryId = (category, productType) => {
  if (productType === 'grocery') {
    return GROCERY_CATEGORIES[category] || category;
  } else {
    return OTHER_CATEGORIES[category] || category;
  }
};

// Helper function to get city ID
export const getCityId = (city) => {
  return CITY_MAPPINGS[city] || city;
};

// Get all grocery categories for dropdown
export const getGroceryCategories = () => {
  return Object.keys(GROCERY_CATEGORIES);
};

// Get all other categories for dropdown
export const getOtherCategories = () => {
  return Object.keys(OTHER_CATEGORIES);
};

// Get all cities for dropdown
export const getCities = () => {
  return Object.keys(CITY_MAPPINGS);
}; 