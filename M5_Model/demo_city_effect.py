#!/usr/bin/env python3
"""
Demo script to show city parameter effect on predictions
"""

import requests
import json
from datetime import datetime

def demo_city_effect():
    """Demonstrate city parameter effect"""
    base_url = "http://localhost:5000"
    
    print("🏙️ CITY PARAMETER EFFECT DEMO")
    print("=" * 50)
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Test with different cities
    cities = ["CA_1", "CA_2", "CA_3", "CA_4", "CA_5"]
    
    print("📊 Testing same parameters with different cities:")
    print("-" * 50)
    
    results = []
    
    for i, city in enumerate(cities, 1):
        data = {
            "days_to_expiry": 7,
            "dept_id": "FOODS_1",
            "date": "2024-01-15",
            "city": city
        }
        
        print(f"\n{i}. Testing City: {city}")
        
        try:
            response = requests.post(f"{base_url}/predict/single", 
                                   json=data, 
                                   headers={'Content-Type': 'application/json'})
            
            if response.status_code == 200:
                result = response.json()
                price = result['data']['predicted_price']
                
                print(f"   ✅ Price: ${price:.2f}")
                results.append({'city': city, 'price': price})
            else:
                print(f"   ❌ Error: {response.status_code}")
        except Exception as e:
            print(f"   ❌ Exception: {e}")
    
    # Also test without city
    print(f"\n{len(cities) + 1}. Testing without city parameter")
    data_no_city = {
        "days_to_expiry": 7,
        "dept_id": "FOODS_1",
        "date": "2024-01-15"
    }
    
    try:
        response = requests.post(f"{base_url}/predict/single", 
                               json=data_no_city, 
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            result = response.json()
            price = result['data']['predicted_price']
            print(f"   ✅ Price: ${price:.2f}")
            results.append({'city': 'No City', 'price': price})
        else:
            print(f"   ❌ Error: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Exception: {e}")
    
    # Analysis
    print("\n" + "=" * 50)
    print("📈 ANALYSIS")
    print("=" * 50)
    
    if len(results) > 1:
        prices = [r['price'] for r in results if r['price'] is not None]
        
        if prices:
            min_price = min(prices)
            max_price = max(prices)
            avg_price = sum(prices) / len(prices)
            price_range = max_price - min_price
            
            print(f"📊 Statistics:")
            print(f"   • Average Price: ${avg_price:.2f}")
            print(f"   • Min Price: ${min_price:.2f}")
            print(f"   • Max Price: ${max_price:.2f}")
            print(f"   • Price Range: ${price_range:.2f}")
            
            print(f"\n🏆 Results by City:")
            for result in results:
                if result['price'] is not None:
                    diff_from_avg = result['price'] - avg_price
                    print(f"   • {result['city']}: ${result['price']:.2f} ({diff_from_avg:+.2f})")
            
            print(f"\n🎯 Conclusion:")
            if price_range > 0.01:
                print("   ✅ City parameter IS affecting predictions!")
                print("   📍 Different cities show different price predictions")
            else:
                print("   ⚠️ City parameter has minimal effect")
                print("   💡 Model may need retraining with city-specific data")
        else:
            print("   ❌ No valid results to analyze")
    else:
        print("   ❌ Not enough data for analysis")

if __name__ == "__main__":
    demo_city_effect() 