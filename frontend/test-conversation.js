// Test Advanced Conversation Memory Features
const fetch = require('node-fetch');

async function testConversationMemory() {
  const BASE_URL = 'http://localhost:5000/api/voice';
  const sessionId = 'test-session-' + Date.now();
  
  console.log('🧪 Testing Advanced Conversation Memory Features...\n');
  
  // Test 1: Initial query about phones
  console.log('Test 1: Initial query about phones');
  try {
    const response1 = await fetch(`${BASE_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Show me eco-friendly phones under 50000',
        sessionId: sessionId
      })
    });
    
    const data1 = await response1.json();
    console.log('Response:', data1.reply);
    console.log('Products found:', data1.products?.length || 0);
    console.log('Mode:', data1.mode);
    console.log('---\n');
    
    // Test 2: Follow-up referring to previous query
    console.log('Test 2: Follow-up referring to previous query');
    const response2 = await fetch(`${BASE_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Tell me more about that phone',
        sessionId: sessionId
      })
    });
    
    const data2 = await response2.json();
    console.log('Response:', data2.reply);
    console.log('Context detected:', data2.context?.isPreviousRef || false);
    console.log('Conversation length:', data2.conversationLength);
    console.log('---\n');
    
    // Test 3: Comparison query
    console.log('Test 3: Comparison query');
    const response3 = await fetch(`${BASE_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Compare it with laptops',
        sessionId: sessionId
      })
    });
    
    const data3 = await response3.json();
    console.log('Response:', data3.reply);
    console.log('Context detected:', data3.context?.isComparison || false);
    console.log('Final conversation length:', data3.conversationLength);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('Make sure the server is running on localhost:5000');
  }
}

// Run the test
testConversationMemory();
