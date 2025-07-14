#!/usr/bin/env python3
"""
Demo script for M5 Expiry Price Predictor
This script demonstrates how to use the prediction system with various examples.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from predict_expiry_price import ExpiryPricePredictor
import matplotlib.pyplot as plt
import seaborn as sns

def demo_single_predictions():
    """Demonstrate single predictions"""
    print("🍽️ M5 Expiry Price Predictor - Demo")
    print("=" * 50)
    
    # Initialize predictor
    predictor = ExpiryPricePredictor()
    
    print("\n📊 Model Information:")
    info = predictor.get_model_info()
    for key, value in info.items():
        print(f"  {key}: {value}")
    
    print("\n🔮 Single Predictions Demo:")
    print("-" * 30)
    
    # Test different scenarios
    scenarios = [
        {"days": 1, "dept": "FOODS_1", "desc": "Fresh food expiring tomorrow"},
        {"days": 7, "dept": "FOODS_2", "desc": "Semi-perishable food expiring in a week"},
        {"days": 30, "dept": "FOODS_3", "desc": "Non-perishable food expiring in a month"},
        {"days": 3, "dept": "FOODS_1", "desc": "Fresh food expiring in 3 days"},
        {"days": 15, "dept": "FOODS_2", "desc": "Semi-perishable food expiring in 15 days"}
    ]
    
    for i, scenario in enumerate(scenarios, 1):
        result = predictor.predict_single(
            days_to_expiry=scenario["days"],
            dept_id=scenario["dept"],
            date='2024-01-15'
        )
        
        price = result['predicted_price'].iloc[0]
        print(f"\n{i}. {scenario['desc']}")
        print(f"   Department: {scenario['dept']}")
        print(f"   Days to Expiry: {scenario['days']}")
        print(f"   Predicted Price: ${price:.2f}")

def demo_batch_predictions():
    """Demonstrate batch predictions"""
    print("\n📦 Batch Predictions Demo:")
    print("-" * 30)
    
    predictor = ExpiryPricePredictor()
    
    # Create sample inventory data
    inventory_data = pd.DataFrame({
        'days_to_expiry': [1, 2, 3, 5, 7, 10, 15, 20, 30],
        'dept_id': ['FOODS_1', 'FOODS_1', 'FOODS_1', 'FOODS_2', 'FOODS_2', 'FOODS_2', 'FOODS_3', 'FOODS_3', 'FOODS_3'],
        'date': ['2024-01-15'] * 9
    })
    
    print("Sample Inventory:")
    print(inventory_data)
    
    # Make batch predictions
    results = predictor.predict_batch(inventory_data)
    
    print("\nPrediction Results:")
    print("-" * 50)
    print(f"{'Days':<5} {'Department':<10} {'Price':<10}")
    print("-" * 30)
    
    for idx, row in results.iterrows():
        print(f"{row['days_to_expiry']:<5} {row['dept_id']:<10} ${row['predicted_price']:<9.2f}")

def demo_price_analysis():
    """Demonstrate price analysis across different expiry days"""
    print("\n📈 Price Analysis Demo:")
    print("-" * 30)
    
    predictor = ExpiryPricePredictor()
    
    # Analyze price trends for each department
    departments = ['FOODS_1', 'FOODS_2', 'FOODS_3']
    max_days = 30
    
    for dept in departments:
        print(f"\n📊 {dept} - Price Analysis (1-{max_days} days):")
        print("-" * 40)
        
        # Create analysis data
        analysis_data = []
        for days in range(1, max_days + 1):
            analysis_data.append({
                'days_to_expiry': days,
                'dept_id': dept,
                'date': '2024-01-15'
            })
        
        input_df = pd.DataFrame(analysis_data)
        results = predictor.predict_batch(input_df)
        
        # Show key statistics
        prices = results['predicted_price'].dropna()
        if len(prices) > 0:
            print(f"  Average Price: ${prices.mean():.2f}")
            print(f"  Min Price: ${prices.min():.2f}")
            print(f"  Max Price: ${prices.max():.2f}")
            print(f"  Price Range: ${prices.max() - prices.min():.2f}")
            
            # Show price trend
            print(f"  Price Trend: {'Decreasing' if prices.iloc[-1] < prices.iloc[0] else 'Increasing'}")
        else:
            print("  No valid predictions")

def demo_visualization():
    """Demonstrate price visualization"""
    print("\n📊 Price Visualization Demo:")
    print("-" * 30)
    
    try:
        predictor = ExpiryPricePredictor()
        
        # Create comprehensive analysis data
        all_data = []
        departments = ['FOODS_1', 'FOODS_2', 'FOODS_3']
        
        for dept in departments:
            for days in range(1, 31):
                all_data.append({
                    'days_to_expiry': days,
                    'dept_id': dept,
                    'date': '2024-01-15'
                })
        
        input_df = pd.DataFrame(all_data)
        results = predictor.predict_batch(input_df)
        
        # Create visualization
        plt.figure(figsize=(12, 8))
        
        for dept in departments:
            dept_data = results[results['dept_id'] == dept]
            if not dept_data.empty:
                plt.plot(dept_data['days_to_expiry'], dept_data['predicted_price'], 
                        marker='o', label=dept, linewidth=2, markersize=4)
        
        plt.xlabel('Days to Expiry')
        plt.ylabel('Predicted Price ($)')
        plt.title('Price Prediction vs Days to Expiry')
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        
        # Save the plot
        plt.savefig('price_analysis.png', dpi=300, bbox_inches='tight')
        print("✅ Price analysis chart saved as 'price_analysis.png'")
        
        # Show the plot
        plt.show()
        
    except ImportError:
        print("⚠️ matplotlib not available. Skipping visualization.")
    except Exception as e:
        print(f"⚠️ Visualization failed: {e}")

def demo_api_integration():
    """Demonstrate API integration"""
    print("\n🌐 API Integration Demo:")
    print("-" * 30)
    
    try:
        import requests
        
        # Test API health
        try:
            response = requests.get("http://localhost:5000/health", timeout=5)
            if response.status_code == 200:
                print("✅ API server is running")
                
                # Test single prediction via API
                payload = {
                    "days_to_expiry": 5,
                    "dept_id": "FOODS_1",
                    "date": "2024-01-15"
                }
                
                response = requests.post(
                    "http://localhost:5000/predict/single",
                    json=payload,
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data['status'] == 'success':
                        price = data['data']['predicted_price']
                        print(f"✅ API prediction successful: ${price:.2f}")
                    else:
                        print(f"❌ API prediction failed: {data['message']}")
                else:
                    print(f"❌ API request failed: {response.status_code}")
            else:
                print("❌ API server is not responding correctly")
                
        except requests.exceptions.RequestException:
            print("⚠️ API server is not running. Start the server with 'python app.py'")
            
    except ImportError:
        print("⚠️ requests library not available. Install with: pip install requests")

def main():
    """Run all demos"""
    print("🚀 Starting M5 Expiry Price Predictor Demo")
    print("=" * 60)
    
    # Run different demos
    demos = [
        ("Single Predictions", demo_single_predictions),
        ("Batch Predictions", demo_batch_predictions),
        ("Price Analysis", demo_price_analysis),
        ("API Integration", demo_api_integration),
        ("Visualization", demo_visualization)
    ]
    
    for demo_name, demo_func in demos:
        try:
            print(f"\n{'='*20} {demo_name} {'='*20}")
            demo_func()
        except Exception as e:
            print(f"❌ {demo_name} demo failed: {e}")
    
    print("\n" + "=" * 60)
    print("🎉 Demo completed!")
    print("\n💡 Next steps:")
    print("   1. Start the web server: python app.py")
    print("   2. Open browser: http://localhost:5000")
    print("   3. Run tests: python test_prediction.py")
    print("   4. Check the generated price_analysis.png file")

if __name__ == "__main__":
    main() 