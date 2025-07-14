#!/usr/bin/env python3
"""
Fixed test script for city parameter - works with existing model
"""

import requests
import json

def test_city_fixed():
    """Test city parameter with fixed approach"""
    base_url = "http://localhost:5000"
    
    print("🔧 Testing City Parameter (Fixed Approach)")
    print("=" * 50)
    
    # Test cases
    test_cases = [
        {
            "name": "With City CA_1",
            "data": {
                "days_to_expiry": 5,
                "dept_id": "FOODS_1",
                "date": "2024-01-15",
                "city": "CA_1"
            }
        },
        {
            "name": "With City CA_2",
            "data": {
                "days_to_expiry": 5,
                "dept_id": "FOODS_1",
                "date": "2024-01-15",
                "city": "CA_2"
            }
        },
        {
            "name": "Without City",
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
                    'name': test_case['name'],
                    'city': city,
                    'price': predicted_price
                })
            else:
                print(f"   ❌ Failed: {response.status_code}")
                print(f"   Error: {response.text}")
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    # Analysis
    print("\n" + "=" * 50)
    print("📊 RESULTS ANALYSIS")
    print("=" * 50)
    
    if len(results) > 1:
        prices = [r['price'] for r in results if r['price'] is not None]
        
        if prices:
            min_price = min(prices)
            max_price = max(prices)
            avg_price = sum(prices) / len(prices)
            
            print(f"📈 Price Statistics:")
            print(f"   • Average: ${avg_price:.2f}")
            print(f"   • Min: ${min_price:.2f}")
            print(f"   • Max: ${max_price:.2f}")
            
            print(f"\n🏆 Individual Results:")
            for result in results:
                if result['price'] is not None:
                    diff = result['price'] - avg_price
                    print(f"   • {result['name']}: ${result['price']:.2f} ({diff:+.2f})")
            
            print(f"\n🎯 Conclusion:")
            if max_price - min_price > 0.01:
                print("   ✅ Different cities show different prices!")
            else:
                print("   ⚠️ All cities show similar prices")
                print("   💡 City parameter is accepted but doesn't affect prediction")
                print("   📝 Model needs retraining with city data for real effect")
        else:
            print("   ❌ No valid results")
    else:
        print("   ❌ Not enough data for analysis")

if __name__ == "__main__":
    test_city_fixed() 