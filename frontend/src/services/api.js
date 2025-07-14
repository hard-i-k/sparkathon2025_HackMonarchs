import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:8080';

// Note: Authentication endpoints don't exist in current backend
// These functions are kept for future implementation
export const loginUser = async (email, password) => {
  console.warn('Auth endpoints not implemented in backend yet');
  return { success: false, error: 'Authentication not implemented' };
};

export const registerUser = async (userData) => {
  console.warn('Auth endpoints not implemented in backend yet');
  return { success: false, error: 'Authentication not implemented' };
};

// API service functions
export const api = {
  // Grocery Products
  addGroceryProduct: (data) => axios.post('/api/products/grocery', data),
  getGroceryProducts: () => axios.get('/api/products/grocery'),
  updateGroceryPrice: (id, price) => axios.patch(/api/products/grocery/${id}/price, { sellingPrice: price }),
  updateGroceryProduct: (id, data) => axios.patch(/api/products/grocery/${id}, data),
  deleteGroceryProduct: (id) => axios.delete(/api/products/grocery/${id}),
  getGroceryBySeller: (sellerId) => axios.get(/api/products/grocery/seller/${sellerId}),
  getGroceryMLData: (id) => axios.get(/api/products/grocery/ml-data/${id}),
  getGroceryBestPrice: (id) => axios.get(/api/products/grocery/${id}/best-price),

  // ML Model Price Prediction for Grocery
  predictGroceryPrice: (payload) => axios.post('http://localhost:5000/predict/single', payload),

  // Other Products
  addOtherProduct: (data) => axios.post('/api/products/other', data),
  getOtherProducts: () => axios.get('/api/products/other'),
  updateOtherPrice: (id, price) => axios.patch(/api/products/other/${id}/price, { sellingPrice: price }),
  updateOtherProduct: (id, data) => axios.patch(/api/products/other/${id}, data),
  deleteOtherProduct: (id) => axios.delete(/api/products/other/${id}),
  getOtherBySeller: (sellerId) => axios.get(/api/products/other/seller/${sellerId}),
  getOtherMLData: (id) => axios.get(/api/products/other/ml-data/${id}),
  getOtherBestPrice: (id) => axios.get(/api/products/other/${id}/best-price),

  // Configuration
  getGroceryCategories: () => axios.get('/api/config/grocery-categories'),
  getOtherCategories: () => axios.get('/api/config/other-categories'),
  getCities: () => axios.get('/api/config/cities'),
  getAllConfig: () => axios.get('/api/config/all'),

  // Voice Assistant - DISABLED
  // sendVoiceMessage: (message) => axios.post('/api/voice/chat', { message }),
  // getVoiceHistory: () => axios.get('/api/voice/history'),

  // Product Recommendations (for voice assistant) - DISABLED
  // getRecommendations: async (query) => {
  //   const lowerQuery = query.toLowerCase();
  //   console.log("Voice query received:", query);

  //   // Define product categories based on voice commands
  //   const products = {
  //     phones: [
  //       {
  //         id: "phone1",
  //         name: "EcoPhone Pro Max",
  //         image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300",
  //         price: 899.99,
  //         carbonScore: 2,
  //         reason: "Made with 90% recycled materials, solar charging capability",
  //       },
  //       {
  //         id: "phone2",
  //         name: "GreenTech Smartphone",
  //         image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300",
  //         price: 649.99,
  //         carbonScore: 3,
  //         reason: "Carbon-neutral manufacturing, biodegradable packaging",
  //       },
  //     ],
  //     laptops: [
  //       {
  //         id: "laptop1",
  //         name: "Sustainable MacBook Air",
  //         image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300",
  //         price: 999.99,
  //         carbonScore: 3,
  //         reason: "Energy-efficient processor, recycled aluminum body",
  //       },
  //       {
  //         id: "laptop2",
  //         name: "Eco ThinkPad Carbon",
  //         image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300",
  //         price: 799.99,
  //         carbonScore: 2,
  //         reason: "Low power consumption, sustainable materials",
  //       },
  //     ],
  //     food: [
  //       {
  //         id: "food1",
  //         name: "Organic Quinoa",
  //         image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300",
  //         price: 12.99,
  //         carbonScore: 1,
  //         reason: "Locally sourced, minimal packaging, organic certified",
  //       },
  //       {
  //         id: "food2",
  //         name: "Plant-Based Protein",
  //         image: "https://images.unsplash.com/photo-1544467500-7e40d838468e?w=300",
  //         price: 19.99,
  //         carbonScore: 2,
  //         reason: "Sustainable protein alternative, eco-friendly packaging",
  //       },
  //     ],
  //     electronics: [
  //       {
  //         id: "elec1",
  //         name: "Solar Power Bank",
  //         image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300",
  //         price: 89.99,
  //         carbonScore: 1,
  //         reason: "100% renewable energy, no grid dependency",
  //       },
  //       {
  //         id: "elec2",
  //         name: "Energy-Efficient LED Strip",
  //         image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300",
  //         price: 34.99,
  //         carbonScore: 2,
  //         reason: "90% less energy consumption than traditional lighting",
  //       },
  //     ],
  //   };

  //   // Smart voice command parsing
  //   let selectedProducts = [];

  //   if (lowerQuery.includes('phone') || lowerQuery.includes('mobile') || lowerQuery.includes('smartphone')) {
  //     selectedProducts = products.phones;
  //   } else if (lowerQuery.includes('laptop') || lowerQuery.includes('computer') || lowerQuery.includes('macbook')) {
  //     selectedProducts = products.laptops;
  //   } else if (lowerQuery.includes('food') || lowerQuery.includes('organic') || lowerQuery.includes('eat')) {
  //     selectedProducts = products.food;
  //   } else if (lowerQuery.includes('electronic') || lowerQuery.includes('gadget') || lowerQuery.includes('device')) {
  //     selectedProducts = products.electronics;
  //   } else if (lowerQuery.includes('eco') || lowerQuery.includes('green') || lowerQuery.includes('sustainable')) {
  //     // Mix of all eco-friendly products
  //     selectedProducts = [
  //       ...products.phones.slice(0, 1),
  //       ...products.electronics.slice(0, 1),
  //       ...products.food.slice(0, 1),
  //     ];
  //   } else if (lowerQuery.includes('cheap') || lowerQuery.includes('under') || lowerQuery.includes('budget')) {
  //     // Filter by price range
  //     const allProducts = [...products.phones, ...products.laptops, ...products.food, ...products.electronics];
  //     if (lowerQuery.includes('1000')) {
  //       selectedProducts = allProducts.filter(p => p.price < 1000);
  //     } else {
  //       selectedProducts = allProducts.filter(p => p.price < 500);
  //     }
  //   } else {
  //     // Default recommendations for unclear queries
  //     selectedProducts = [
  //       products.phones[0],
  //       products.electronics[0],
  //       products.food[0],
  //     ];
  //   }

  //   // Simulate API delay
  //   await new Promise(resolve => setTimeout(resolve, 1000));

  //   return selectedProducts.slice(0, 3); // Return max 3 recommendations
  // },
};

export default api;