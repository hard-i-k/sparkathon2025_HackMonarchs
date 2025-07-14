#!/usr/bin/env python3
"""
Test script for M5 Expiry Price Predictor
This script tests the prediction functionality and API endpoints.
"""

import requests
import json
import time
import logging
from datetime import datetime
from predict_expiry_price import ExpiryPricePredictor

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PredictionTester:
    """Test class for the prediction system"""
    
    def __init__(self, api_url="http://localhost:5000"):
        self.api_url = api_url
        self.predictor = ExpiryPricePredictor()
        
    def test_model_loading(self):
        """Test if models load correctly"""
        logger.info("🧪 Testing model loading...")
        try:
            info = self.predictor.get_model_info()
            logger.info(f"✅ Models loaded successfully: {info}")
            return True
        except Exception as e:
            logger.error(f"❌ Model loading failed: {e}")
            return False
    
    def test_single_prediction(self):
        """Test single prediction functionality"""
        logger.info("🧪 Testing single prediction...")
        try:
            result = self.predictor.predict_single(
                days_to_expiry=5,
                dept_id='FOODS_1',
                date='2024-01-15'
            )
            price = result['predicted_price'].iloc[0]
            logger.info(f"✅ Single prediction successful: ${price:.2f}")
            return True
        except Exception as e:
            logger.error(f"❌ Single prediction failed: {e}")
            return False
    
    def test_batch_prediction(self):
        """Test batch prediction functionality"""
        logger.info("🧪 Testing batch prediction...")
        try:
            import pandas as pd
            test_data = pd.DataFrame({
                'days_to_expiry': [3, 7, 10],
                'dept_id': ['FOODS_1', 'FOODS_2', 'FOODS_3'],
                'date': ['2024-01-15', '2024-01-15', '2024-01-15']
            })
            
            results = self.predictor.predict_batch(test_data)
            logger.info(f"✅ Batch prediction successful: {len(results)} items")
            for idx, row in results.iterrows():
                logger.info(f"   Item {idx+1}: ${row['predicted_price']:.2f}")
            return True
        except Exception as e:
            logger.error(f"❌ Batch prediction failed: {e}")
            return False
    
    def test_api_health(self):
        """Test API health endpoint"""
        logger.info("🧪 Testing API health...")
        try:
            response = requests.get(f"{self.api_url}/health", timeout=5)
            if response.status_code == 200:
                data = response.json()
                logger.info(f"✅ API health check successful: {data}")
                return True
            else:
                logger.error(f"❌ API health check failed: {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ API health check failed: {e}")
            return False
    
    def test_api_single_prediction(self):
        """Test API single prediction endpoint"""
        logger.info("🧪 Testing API single prediction...")
        try:
            payload = {
                "days_to_expiry": 5,
                "dept_id": "FOODS_1",
                "date": "2024-01-15"
            }
            
            response = requests.post(
                f"{self.api_url}/predict/single",
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data['status'] == 'success':
                    price = data['data']['predicted_price']
                    logger.info(f"✅ API single prediction successful: ${price:.2f}")
                    return True
                else:
                    logger.error(f"❌ API single prediction failed: {data['message']}")
                    return False
            else:
                logger.error(f"❌ API single prediction failed: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ API single prediction failed: {e}")
            return False
    
    def test_api_batch_prediction(self):
        """Test API batch prediction endpoint"""
        logger.info("🧪 Testing API batch prediction...")
        try:
            payload = {
                "items": [
                    {
                        "days_to_expiry": 5,
                        "dept_id": "FOODS_1",
                        "date": "2024-01-15"
                    },
                    {
                        "days_to_expiry": 10,
                        "dept_id": "FOODS_2",
                        "date": "2024-01-15"
                    }
                ]
            }
            
            response = requests.post(
                f"{self.api_url}/predict/batch",
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data['status'] == 'success':
                    predictions = data['data']['predictions']
                    logger.info(f"✅ API batch prediction successful: {len(predictions)} items")
                    for pred in predictions:
                        logger.info(f"   {pred['dept_id']}: ${pred['predicted_price']:.2f}")
                    return True
                else:
                    logger.error(f"❌ API batch prediction failed: {data['message']}")
                    return False
            else:
                logger.error(f"❌ API batch prediction failed: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ API batch prediction failed: {e}")
            return False
    
    def test_api_analysis(self):
        """Test API analysis endpoint"""
        logger.info("🧪 Testing API analysis...")
        try:
            payload = {
                "dept_id": "FOODS_1",
                "date": "2024-01-15",
                "max_days": 10
            }
            
            response = requests.post(
                f"{self.api_url}/predict/analysis",
                json=payload,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                if data['status'] == 'success':
                    analysis = data['data']['analysis']
                    logger.info(f"✅ API analysis successful: {len(analysis)} days analyzed")
                    return True
                else:
                    logger.error(f"❌ API analysis failed: {data['message']}")
                    return False
            else:
                logger.error(f"❌ API analysis failed: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ API analysis failed: {e}")
            return False
    
    def run_all_tests(self):
        """Run all tests"""
        logger.info("🚀 Starting comprehensive test suite...")
        logger.info("=" * 50)
        
        tests = [
            ("Model Loading", self.test_model_loading),
            ("Single Prediction", self.test_single_prediction),
            ("Batch Prediction", self.test_batch_prediction),
            ("API Health", self.test_api_health),
            ("API Single Prediction", self.test_api_single_prediction),
            ("API Batch Prediction", self.test_api_batch_prediction),
            ("API Analysis", self.test_api_analysis)
        ]
        
        results = []
        
        for test_name, test_func in tests:
            logger.info(f"\n📋 Running: {test_name}")
            try:
                success = test_func()
                results.append((test_name, success))
                if success:
                    logger.info(f"✅ {test_name}: PASSED")
                else:
                    logger.error(f"❌ {test_name}: FAILED")
            except Exception as e:
                logger.error(f"❌ {test_name}: ERROR - {e}")
                results.append((test_name, False))
        
        # Summary
        logger.info("\n" + "=" * 50)
        logger.info("📊 TEST SUMMARY")
        logger.info("=" * 50)
        
        passed = sum(1 for _, success in results if success)
        total = len(results)
        
        for test_name, success in results:
            status = "✅ PASSED" if success else "❌ FAILED"
            logger.info(f"{test_name}: {status}")
        
        logger.info(f"\n🎯 Overall: {passed}/{total} tests passed")
        
        if passed == total:
            logger.info("🎉 All tests passed! System is working correctly.")
        else:
            logger.warning(f"⚠️ {total - passed} tests failed. Please check the issues above.")
        
        return passed == total

def main():
    """Main function"""
    logger.info("🍽️ M5 Expiry Price Predictor - Test Suite")
    
    # Check if API server is running
    tester = PredictionTester()
    
    try:
        # Test if API is accessible
        response = requests.get("http://localhost:5000/health", timeout=2)
        if response.status_code == 200:
            logger.info("🌐 API server is running")
        else:
            logger.warning("⚠️ API server might not be running. Starting local tests only...")
    except:
        logger.warning("⚠️ API server is not running. Starting local tests only...")
    
    # Run tests
    success = tester.run_all_tests()
    
    if success:
        logger.info("\n🎉 All tests completed successfully!")
        return 0
    else:
        logger.error("\n❌ Some tests failed. Please check the issues above.")
        return 1

if __name__ == "__main__":
    import sys
    sys.exit(main()) 