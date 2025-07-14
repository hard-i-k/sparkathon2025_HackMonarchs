#!/usr/bin/env python3
"""
Test script to demonstrate city parameter effect on predictions
"""

import requests
import json

def test_city_effect():
    """Test how city parameter affects predictions"""
    base_url = "http://localhost:5000"
    
    print("🧪 Testing City Parameter Effect on Predictions")
    print("=" * 60)
    
    # Test data - same parameters, different cities
    test_cases = [
        {
            "name": "CA_1",
            "data": {
                "days_to_expiry": 5,
                "dept_id": "FOODS_1",
                "date": "2024-01-15",
                "city": "CA_1"
            }
        },
        {
            "name": "CA_2", 
            "data": {
                "days_to_expiry": 5,
                "dept_id": "FOODS_1",
                "date": "2024-01-15",
                "city": "CA_2"
            }
        },
        {
            "name": "CA_3",
            "data": {
                "days_to_expiry": 5,
                "dept_id": "FOODS_1", 
                "date": "2024-01-15",
                "city": "CA_3"
            }
        },
        {
            "name": "No City",
            "data": {
                "days_to_expiry": 5,
                "dept_id": "FOODS_1",
                "date": "2024-01-15"
            }
        }
    ]
    
    results = []
    
    for test_case in test_cases:
        print(f"\n📍 Testing: {test_case['name']}")
        
        try:
            response = requests.post(f"{base_url}/predict/single", 
                                   json=test_case['data'], 
                                   headers={'Content-Type': 'application/json'})
            
            if response.status_code == 200:
                result = response.json()
                predicted_price = result['data']['predicted_price']
                city = result['data'].get('city', 'None')
                
                print(f"   ✅ City: {city}")
                print(f"   💰 Predicted Price: ${predicted_price:.2f}")
                
                results.append({
                    'city': city,
                    'price': predicted_price,
                    'name': test_case['name']
                })
            else:
                print(f"   ❌ Failed: {response.status_code}")
                print(f"   Error: {response.text}")
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    # Compare results
    print("\n" + "=" * 60)
    print("📊 COMPARISON RESULTS")
    print("=" * 60)
    
    if len(results) > 1:
        base_price = results[0]['price']
        print(f"Base Price (CA_1): ${base_price:.2f}")
        
        for result in results[1:]:
            diff = result['price'] - base_price
            percent_diff = (diff / base_price) * 100 if base_price != 0 else 0
            print(f"{result['name']}: ${result['price']:.2f} (Diff: {diff:+.2f}, {percent_diff:+.1f}%)")
    
    print("\n🎯 Analysis:")
    if len(results) > 1:
        prices = [r['price'] for r in results if r['price'] is not None]
        if prices:
            min_price = min(prices)
            max_price = max(prices)
            price_range = max_price - min_price
            
            print(f"   • Price Range: ${price_range:.2f}")
            print(f"   • Min Price: ${min_price:.2f}")
            print(f"   • Max Price: ${max_price:.2f}")
            
            if price_range > 0.01:  # If there's meaningful difference
                print("   ✅ City parameter is affecting predictions!")
            else:
                print("   ⚠️ City parameter has minimal effect (model may need retraining with city data)")
    else:
        print("   ❌ Not enough data to analyze")

if __name__ == "__main__":
    test_city_effect() 