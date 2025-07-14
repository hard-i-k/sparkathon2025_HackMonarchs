#!/usr/bin/env python3
"""
Test script to verify city parameter functionality
"""

import requests
import json

def test_city_parameter():
    """Test city parameter in API"""
    base_url = "http://localhost:5000"
    
    print("🧪 Testing City Parameter Functionality")
    print("=" * 50)
    
    # Test 1: Single prediction with city
    print("\n1. Testing single prediction with city parameter...")
    single_data = {
        "days_to_expiry": 5,
        "dept_id": "FOODS_1",
        "date": "2024-01-15",
        "city": "CA_1"
    }
    
    try:
        response = requests.post(f"{base_url}/predict/single", 
                               json=single_data, 
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Single prediction with city successful!")
            print(f"   Predicted price: ${result['data']['predicted_price']:.2f}")
            print(f"   City: {result['data']['city']}")
        else:
            print(f"❌ Single prediction failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 2: Batch prediction with city
    print("\n2. Testing batch prediction with city parameter...")
    batch_data = {
        "items": [
            {
                "days_to_expiry": 5,
                "dept_id": "FOODS_1",
                "date": "2024-01-15",
                "city": "CA_1"
            },
            {
                "days_to_expiry": 10,
                "dept_id": "FOODS_2",
                "date": "2024-01-15",
                "city": "CA_2"
            }
        ]
    }
    
    try:
        response = requests.post(f"{base_url}/predict/batch", 
                               json=batch_data, 
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Batch prediction with city successful!")
            for i, pred in enumerate(result['data']['predictions']):
                print(f"   Item {i+1}: ${pred['predicted_price']:.2f} (City: {pred.get('city', 'N/A')})")
        else:
            print(f"❌ Batch prediction failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 3: Save prediction with city
    print("\n3. Testing save prediction with city parameter...")
    save_data = {
        "days_to_expiry": 7,
        "dept_id": "FOODS_3",
        "date": "2024-01-20",
        "city": "CA_3"
    }
    
    try:
        response = requests.post(f"{base_url}/save-prediction", 
                               json=save_data, 
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Save prediction with city successful!")
            print(f"   Saved to MongoDB with city: {result['data']['city']}")
        else:
            print(f"❌ Save prediction failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n🎉 City parameter testing completed!")

if __name__ == "__main__":
    test_city_parameter() 