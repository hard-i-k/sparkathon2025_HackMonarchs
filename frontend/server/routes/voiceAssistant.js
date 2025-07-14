const express = require('express');
const router = express.Router();

// Advanced Voice Assistant with Memory & Context
let conversationMemory = new Map(); // Store user conversations
let productRecommendations = new Map(); // Store product history

// Free AI API Integration - Using native fetch (no extra packages needed!)
// Google Gemini API (Free tier) - just need API key from https://makersuite.google.com

// Basic voice assistant endpoint
router.get('/status', (req, res) => {
  res.json({ 
    status: 'Voice Assistant is running',
    mode: process.env.GEMINI_API_KEY ? 'AI-Powered (Gemini)' : 'Basic NLP',
    freeAI: true,
    timestamp: new Date().toISOString()
  });
});

// Enhanced voice query with ADVANCED AI integration
router.post('/query', (req, res) => {
  const { text, sessionId = 'default' } = req.body;
  
  if (!text) {
    return res.status(400).json({ 
      error: 'Text is required' 
    });
  }

  // Advanced: Check for conversational context
  const context = getConversationContext(sessionId, text);
  
  console.log(`🎤 Advanced Voice Query: "${text}" (Session: ${sessionId}, Context: ${JSON.stringify(context)})`);
  
  // Check if free AI API is available and process accordingly
  if (process.env.GEMINI_API_KEY) {
    processWithAdvancedAI(text, sessionId, context, res);
  } else {
    // Enhanced basic NLP (still very good!)
    const response = processAdvancedVoiceQuery(text, context);
    
    // Store conversation for context
    storeConversation(sessionId, text, response.reply);
    
    res.json({
      query: text,
      reply: response.reply + " 🤖",
      action: response.action,
      products: response.products || [],
      context: context,
      mode: 'enhanced_basic',
      conversationLength: (conversationMemory.get(sessionId) || []).length,
      timestamp: new Date().toISOString()
    });
  }
});

// Advanced conversation memory functions
function getConversationContext(sessionId, currentText) {
  const userHistory = conversationMemory.get(sessionId) || [];
  const recentProducts = productRecommendations.get(sessionId) || [];
  
  // Detect if user is referring to previous conversation
  const contextClues = {
    isPreviousRef: /earlier|before|previous|that|those|compare|vs/i.test(currentText),
    isFollowUp: /more|also|another|different|better|cheaper/i.test(currentText),
    isComparison: /compare|vs|versus|which is better|difference/i.test(currentText),
    recentQueries: userHistory.slice(-3), // Last 3 queries
    recentProducts: recentProducts.slice(-5) // Last 5 products
  };
  
  return contextClues;
}

function storeConversation(sessionId, query, response) {
  if (!conversationMemory.has(sessionId)) {
    conversationMemory.set(sessionId, []);
  }
  
  const history = conversationMemory.get(sessionId);
  history.push({
    query,
    response,
    timestamp: new Date().toISOString()
  });
  
  // Keep only last 10 conversations per session
  if (history.length > 10) {
    history.shift();
  }
}

// ADVANCED AI Processing with Context & Memory
async function processWithAdvancedAI(text, sessionId, context, res) {
  try {
    // Build context-aware prompt
    let contextInfo = "";
    if (context.isPreviousRef && context.recentProducts.length > 0) {
      contextInfo = `\nContext: User previously asked about: ${context.recentProducts.map(p => p.name).join(', ')}`;
    }
    if (context.recentQueries.length > 0) {
      contextInfo += `\nRecent queries: ${context.recentQueries.map(q => q.query).slice(-2).join(', ')}`;
    }

    const prompt = `You are an advanced eco-friendly shopping assistant for EcoSmart Shop with conversation memory.

    User asked: "${text}"
    ${contextInfo}
    
    ADVANCED INSTRUCTIONS:
    1. If user refers to "earlier/previous/that" - reference their recent products/queries
    2. If asking for "comparison" - compare specific products they mentioned
    3. If asking for "more/another" - suggest different products in same category
    4. Always be contextually aware and conversational
    5. Include WHY products are eco-friendly (recycled materials, energy efficiency, etc.)
    6. Mention specific sustainability benefits
    7. Keep response under 90 words but be helpful
    8. Use relevant emojis naturally
    
    Respond as a smart assistant who remembers the conversation:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (response.ok) {
      const data = await response.json();
      const aiReply = data.candidates[0].content.parts[0].text;
      
      // Extract products with advanced matching
      const products = extractAdvancedProducts(text, context);
      
      // Store products for future reference
      if (products.length > 0) {
        if (!productRecommendations.has(sessionId)) {
          productRecommendations.set(sessionId, []);
        }
        const userProducts = productRecommendations.get(sessionId);
        userProducts.push(...products);
        
        // Keep only last 10 products per session
        if (userProducts.length > 10) {
          userProducts.splice(0, userProducts.length - 10);
        }
      }
      
      // Store conversation
      storeConversation(sessionId, text, aiReply);
      
      res.json({
        query: text,
        reply: aiReply,
        action: "advanced_ai_response",
        products: products,
        context: context,
        conversationLength: (conversationMemory.get(sessionId) || []).length,
        mode: 'advanced_ai_powered',
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error('Gemini API error');
    }
    
  } catch (error) {
    console.error('Advanced AI processing failed, using enhanced basic:', error);
    // Fallback to enhanced basic processing
    const response = processAdvancedVoiceQuery(text, context);
    storeConversation(sessionId, text, response.reply);
    
    res.json({
      query: text,
      reply: response.reply + " 🤖",
      action: response.action,
      products: response.products || [],
      context: context,
      mode: 'enhanced_basic_fallback',
      timestamp: new Date().toISOString()
    });
  }
}

// Enhanced voice processing function (Better than basic!)
function processAdvancedVoiceQuery(text) {
  const lowerText = text.toLowerCase();
  
  // Advanced keyword patterns
  const patterns = {
    phones: ['phone', 'mobile', 'smartphone', 'iphone', 'android', 'cell', 'device to call'],
    laptops: ['laptop', 'computer', 'macbook', 'pc', 'notebook', 'work machine', 'coding machine'],
    food: ['food', 'organic', 'eat', 'grocery', 'snack', 'nutrition', 'healthy', 'diet'],
    electronics: ['electronic', 'gadget', 'device', 'tech', 'solar', 'charger', 'power'],
    sustainability: ['eco', 'green', 'sustainable', 'environment', 'carbon', 'footprint', 'nature'],
    price: ['cheap', 'budget', 'affordable', 'expensive', 'cost', 'price', 'under', 'below']
  };

  // Advanced intent detection with sentiment
  let intent = 'general';
  let sentiment = 'neutral';
  let priceRange = null;

  // Detect price range
  if (/under.*500|below.*500|less.*500/i.test(text)) priceRange = 500;
  if (/under.*1000|below.*1000|less.*1000/i.test(text)) priceRange = 1000;
  if (/under.*2000|below.*2000|less.*2000/i.test(text)) priceRange = 2000;

  // Detect enthusiasm
  if (/awesome|great|amazing|love|best|excellent/i.test(text)) sentiment = 'positive';
  if (/help|need|want|looking|find|search/i.test(text)) sentiment = 'seeking';

  // Smart product detection
  if (containsAny(lowerText, patterns.phones)) {
    let reply = "📱 Fantastic! I've found some incredible eco-friendly smartphones! These devices are crafted with recycled materials and feature energy-efficient processors.";
    if (priceRange) reply += ` I've filtered options under $${priceRange} for you!`;
    if (sentiment === 'positive') reply += " You're going to love these sustainable choices! 🌱";
    
    return {
      reply: reply,
      action: "show_phones",
      products: getEcoPhones(priceRange)
    };
  }
  
  if (containsAny(lowerText, patterns.laptops)) {
    let reply = "💻 Excellent choice! Our sustainable laptops combine powerful performance with environmental responsibility.";
    if (priceRange) reply += ` Here are the best eco-friendly options under $${priceRange}!`;
    reply += " Features include energy-efficient processors and recycled aluminum bodies. 🔋";
    
    return {
      reply: reply,
      action: "show_laptops", 
      products: getEcoLaptops(priceRange)
    };
  }
  
  if (containsAny(lowerText, patterns.food)) {
    let reply = "🥗 Perfect! Our organic food selection features locally sourced, sustainable options with minimal packaging.";
    if (sentiment === 'seeking') reply += " I'll help you find exactly what you need!";
    reply += " Every product includes detailed carbon footprint information. 🌱";
    
    return {
      reply: reply,
      action: "show_food",
      products: getEcoFood()
    };
  }
  
  if (containsAny(lowerText, patterns.electronics)) {
    let reply = "⚡ Amazing! Check out our sustainable electronics collection! Solar-powered devices, energy-efficient gadgets, and eco-friendly tech accessories.";
    if (priceRange) reply += ` I've found great options under $${priceRange}!`;
    
    return {
      reply: reply,
      action: "show_electronics",
      products: getEcoElectronics(priceRange)
    };
  }
  
  // Special queries with personality
  if (containsAny(lowerText, patterns.sustainability)) {
    return {
      reply: "� You're making a fantastic choice caring about sustainability! All our products have detailed carbon footprint calculations. Lower scores mean better environmental impact. Green badges highlight our most eco-friendly choices! 🌱✨",
      action: "explain_carbon"
    };
  }
  
  if (lowerText.includes('reward') || lowerText.includes('points') || lowerText.includes('earn')) {
    return {
      reply: "🎁 Love your eco-conscious shopping! You earn EcoPoints for every sustainable purchase! 💰 1 point per dollar spent. Redeem 100 points for $5 discount on future eco-friendly products! Keep saving the planet! 🌟",
      action: "show_rewards"
    };
  }
  
  if (lowerText.includes('help') || lowerText.includes('what can you do')) {
    return {
      reply: "🤖 Hi there! I'm your eco-friendly shopping assistant! I can help you: 🛍️ Find sustainable products, 🌱 Check carbon footprints, 💰 Compare eco-prices, 🎁 Explain rewards, and 🌍 Answer sustainability questions! What sustainable adventure shall we start with? ✨",
      action: "show_help"
    };
  }
  
  // Smart default response
  return {
    reply: `🎤 I heard "${text}" and I'm excited to help! 🌟 I specialize in eco-friendly products that are good for you AND the planet! 🌍 Try asking about sustainable phones, green laptops, or organic food. What eco-friendly product can I help you discover today? 🛍️✨`,
    action: "default"
  };
}

// ENHANCED Product Extraction with Context Awareness
function extractAdvancedProducts(text, context) {
  const products = [];
  const lowerText = text.toLowerCase();
  
  // If user refers to previous context, prioritize those products
  if (context.isPreviousRef && context.recentProducts.length > 0) {
    return context.recentProducts.slice(-3); // Return last 3 products
  }
  
  // Category-based extraction with eco-friendly focus
  const categories = {
    phones: ['phone', 'smartphone', 'mobile', 'iphone', 'samsung', 'eco phone'],
    laptops: ['laptop', 'computer', 'macbook', 'notebook', 'eco laptop'],
    food: ['food', 'organic', 'fruits', 'vegetables', 'snacks', 'groceries'],
    home: ['home', 'furniture', 'decor', 'appliances', 'cleaning'],
    clothing: ['clothes', 'shirt', 'dress', 'eco fashion', 'sustainable clothing']
  };
  
  // Check each category
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      // Add relevant eco-friendly products
      switch(category) {
        case 'phones':
          products.push(
            { name: 'EcoPhone X1', price: 45000, eco: 'Recycled aluminum body, solar charging' },
            { name: 'GreenTech Phone Pro', price: 55000, eco: 'Biodegradable case, energy efficient' },
            { name: 'Sustainable Smart Phone', price: 35000, eco: 'Refurbished, carbon neutral' }
          );
          break;
        case 'laptops':
          products.push(
            { name: 'EcoBook Pro 15', price: 85000, eco: 'Bamboo keyboard, recycled metals' },
            { name: 'GreenTech Laptop', price: 75000, eco: 'Energy star certified, sustainable materials' },
            { name: 'Eco-Friendly Notebook', price: 65000, eco: 'Refurbished, low power consumption' }
          );
          break;
        case 'food':
          products.push(
            { name: 'Organic Fruits Mix', price: 350, eco: 'Locally sourced, zero pesticides' },
            { name: 'Sustainable Snacks Pack', price: 280, eco: 'Biodegradable packaging, organic' },
            { name: 'Eco-Friendly Groceries', price: 450, eco: 'Bulk buying, minimal packaging' }
          );
          break;
        default:
          products.push(
            { name: 'Eco-Friendly Product', price: 500, eco: 'Sustainable and environment-friendly' }
          );
      }
      break; // Only match first category
    }
  }
  
  // If no specific category, add general eco products
  if (products.length === 0) {
    products.push(
      { name: 'Eco-Smart Bundle', price: 1200, eco: 'Curated sustainable products' },
      { name: 'Green Living Kit', price: 800, eco: 'Zero waste lifestyle starter' }
    );
  }
  
  return products.slice(0, 4); // Return max 4 products
}

// Product extraction helper - Smart matching
function extractProductsFromQuery(text) {
  const lowerText = text.toLowerCase();
  
  // Check for price mentions
  let priceLimit = null;
  if (/under.*500|below.*500|less.*500/i.test(text)) priceLimit = 500;
  if (/under.*1000|below.*1000|less.*1000/i.test(text)) priceLimit = 1000;
  if (/under.*2000|below.*2000|less.*2000/i.test(text)) priceLimit = 2000;
  
  // Smart product detection with price filtering
  if (containsAny(lowerText, ['phone', 'mobile', 'smartphone', 'iphone', 'android'])) {
    return getEcoPhones(priceLimit);
  } else if (containsAny(lowerText, ['laptop', 'computer', 'macbook', 'pc', 'notebook'])) {
    return getEcoLaptops(priceLimit);
  } else if (containsAny(lowerText, ['food', 'organic', 'eat', 'grocery', 'nutrition'])) {
    return getEcoFood();
  } else if (containsAny(lowerText, ['electronic', 'gadget', 'solar', 'charger', 'device'])) {
    return getEcoElectronics(priceLimit);
  } else if (containsAny(lowerText, ['eco', 'green', 'sustainable', 'environment'])) {
    // Mix of eco products if general sustainability query
    return [
      ...getEcoPhones(priceLimit).slice(0, 1),
      ...getEcoElectronics(priceLimit).slice(0, 1),
      ...getEcoFood().slice(0, 1)
    ];
  }
  
  return [];
}

// Helper functions
function containsAny(text, keywords) {
  return keywords.some(keyword => text.includes(keyword));
}

function getEcoPhones(priceLimit = null) {
  const phones = [
    { name: "EcoPhone Pro Max", price: 899, carbon: 2 },
    { name: "GreenTech Smartphone", price: 649, carbon: 3 },
    { name: "Sustainable iPhone SE", price: 429, carbon: 2 },
    { name: "Recycled Android Pro", price: 299, carbon: 1 }
  ];
  
  return priceLimit ? phones.filter(p => p.price <= priceLimit) : phones.slice(0, 2);
}

function getEcoLaptops(priceLimit = null) {
  const laptops = [
    { name: "Sustainable MacBook Air", price: 999, carbon: 3 },
    { name: "Eco ThinkPad Carbon", price: 799, carbon: 2 },
    { name: "Green Gaming Laptop", price: 1299, carbon: 4 },
    { name: "Budget Eco Laptop", price: 499, carbon: 2 }
  ];
  
  return priceLimit ? laptops.filter(p => p.price <= priceLimit) : laptops.slice(0, 2);
}

function getEcoFood() {
  return [
    { name: "Organic Quinoa", price: 12.99, carbon: 1 },
    { name: "Plant-Based Protein", price: 19.99, carbon: 2 },
    { name: "Local Honey", price: 8.99, carbon: 1 },
    { name: "Sustainable Snacks", price: 6.99, carbon: 1 }
  ];
}

function getEcoElectronics(priceLimit = null) {
  const electronics = [
    { name: "Solar Power Bank", price: 89.99, carbon: 1 },
    { name: "Energy-Efficient LED Strip", price: 34.99, carbon: 2 },
    { name: "Eco Wireless Charger", price: 24.99, carbon: 1 },
    { name: "Sustainable Headphones", price: 149.99, carbon: 2 }
  ];
  
  return priceLimit ? electronics.filter(p => p.price <= priceLimit) : electronics.slice(0, 2);
}

module.exports = router;