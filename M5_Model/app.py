from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime
import logging
from predict_expiry_price import ExpiryPricePredictor
from flask_pymongo import PyMongo
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)  # Enable CORS for all routes

# MongoDB config (update URI as needed)
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/m5_predictions')
app.config["MONGO_URI"] = MONGO_URI
mongo = PyMongo(app)

# Initialize the predictor
try:
    predictor = ExpiryPricePredictor()
    logger.info("✅ Predictor initialized successfully")
except Exception as e:
    logger.error(f"❌ Failed to initialize predictor: {str(e)}")
    predictor = None

@app.route('/')
def home():
    """Home endpoint with API information"""
    return jsonify({
        'message': 'M5 Expiry Price Prediction API',
        'version': '1.0.0',
        'endpoints': {
            '/': 'API information',
            '/health': 'Health check',
            '/predict/single': 'Single prediction',
            '/predict/batch': 'Batch prediction',
            '/model/info': 'Model information',
            '/save-prediction': 'Save prediction to MongoDB'
        },
        'supported_departments': ['FOODS_1', 'FOODS_2', 'FOODS_3']
    })

@app.route('/health')
def health_check():
    """Health check endpoint"""
    if predictor is None:
        return jsonify({
            'status': 'error',
            'message': 'Predictor not initialized'
        }), 500
    
    return jsonify({
        'status': 'healthy',
        'message': 'API is running',
        'models_loaded': len(predictor.models) if predictor else 0
    })

@app.route('/model/info')
def model_info():
    """Get model information"""
    if predictor is None:
        return jsonify({
            'status': 'error',
            'message': 'Predictor not initialized'
        }), 500
    
    info = predictor.get_model_info()
    return jsonify({
        'status': 'success',
        'data': info
    })

@app.route('/predict/single', methods=['POST'])
def predict_single():
    """
    Single prediction endpoint
    
    Expected JSON:
    {
        "days_to_expiry": 5,
        "dept_id": "FOODS_1",
        "date": "2024-01-15",
        "city": "CA_1",
        "additional_features": {
            "has_event": 0,
            "promo_impact": 0.1
        }
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'status': 'error',
                'message': 'No data provided'
            }), 400
        
        # Validate required fields
        required_fields = ['days_to_expiry', 'dept_id']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({
                'status': 'error',
                'message': f'Missing required fields: {missing_fields}'
            }), 400
        
        # Extract parameters
        days_to_expiry = int(data['days_to_expiry'])
        dept_id = data['dept_id']
        date = data.get('date', datetime.now().strftime('%Y-%m-%d'))
        city = data.get('city', None)  # Optional city parameter
        additional_features = data.get('additional_features', {})
        
        # Validate department
        if dept_id not in ['FOODS_1', 'FOODS_2', 'FOODS_3']:
            return jsonify({
                'status': 'error',
                'message': f'Invalid department. Must be one of: FOODS_1, FOODS_2, FOODS_3'
            }), 400
        
        # Prepare prediction parameters
        prediction_params = {
            'days_to_expiry': days_to_expiry,
            'dept_id': dept_id,
            'date': date,
            **additional_features
        }
        
        # Add city if provided
        if city:
            prediction_params['city'] = city
        
        # Make prediction
        result = predictor.predict_single(**prediction_params)
        
        predicted_price = result['predicted_price'].iloc[0]
        
        return jsonify({
            'status': 'success',
            'data': {
                'days_to_expiry': days_to_expiry,
                'dept_id': dept_id,
                'date': date,
                'city': city,
                'predicted_price': float(predicted_price) if predicted_price is not None else None,
                'additional_features': additional_features
            }
        })
        
    except Exception as e:
        logger.error(f"Error in single prediction: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Prediction failed: {str(e)}'
        }), 500

@app.route('/predict/batch', methods=['POST'])
def predict_batch():
    """
    Batch prediction endpoint
    
    Expected JSON:
    {
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
    """
    try:
        data = request.get_json()
        
        if not data or 'items' not in data:
            return jsonify({
                'status': 'error',
                'message': 'No items provided'
            }), 400
        
        items = data['items']
        
        if not items:
            return jsonify({
                'status': 'error',
                'message': 'Empty items list'
            }), 400
        
        # Validate all items
        for i, item in enumerate(items):
            if 'days_to_expiry' not in item or 'dept_id' not in item:
                return jsonify({
                    'status': 'error',
                    'message': f'Item {i} missing required fields'
                }), 400
            
            if item['dept_id'] not in ['FOODS_1', 'FOODS_2', 'FOODS_3']:
                return jsonify({
                    'status': 'error',
                    'message': f'Item {i} has invalid department'
                }), 400
        
        # Convert to DataFrame
        df_data = []
        for item in items:
            item_data = {
                'days_to_expiry': int(item['days_to_expiry']),
                'dept_id': item['dept_id'],
                'date': item.get('date', datetime.now().strftime('%Y-%m-%d'))
            }
            # Add city if provided
            if 'city' in item:
                item_data['city'] = item['city']
            df_data.append(item_data)
        
        input_df = pd.DataFrame(df_data)
        
        # Make predictions
        results = predictor.predict_batch(input_df)
        
        # Format results
        predictions = []
        for idx, row in results.iterrows():
            prediction_item = {
                'days_to_expiry': int(row['days_to_expiry']),
                'dept_id': row['dept_id'],
                'date': row['date'],
                'predicted_price': float(row['predicted_price']) if row['predicted_price'] is not None else None
            }
            # Add city if it exists in the data
            if 'city' in row:
                prediction_item['city'] = row['city']
            predictions.append(prediction_item)
        
        return jsonify({
            'status': 'success',
            'data': {
                'predictions': predictions,
                'total_items': len(predictions)
            }
        })
        
    except Exception as e:
        logger.error(f"Error in batch prediction: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Batch prediction failed: {str(e)}'
        }), 500

@app.route('/predict/analysis', methods=['POST'])
def predict_analysis():
    """
    Analysis endpoint - predicts prices for different expiry days
    
    Expected JSON:
    {
        "dept_id": "FOODS_1",
        "date": "2024-01-15",
        "max_days": 30
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'dept_id' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Department ID required'
            }), 400
        
        dept_id = data['dept_id']
        date = data.get('date', datetime.now().strftime('%Y-%m-%d'))
        max_days = data.get('max_days', 30)
        
        if dept_id not in ['FOODS_1', 'FOODS_2', 'FOODS_3']:
            return jsonify({
                'status': 'error',
                'message': 'Invalid department'
            }), 400
        
        # Create analysis data
        analysis_data = []
        for days in range(1, max_days + 1):
            analysis_data.append({
                'days_to_expiry': days,
                'dept_id': dept_id,
                'date': date
            })
        
        input_df = pd.DataFrame(analysis_data)
        results = predictor.predict_batch(input_df)
        
        # Format results
        analysis = []
        for idx, row in results.iterrows():
            analysis.append({
                'days_to_expiry': int(row['days_to_expiry']),
                'predicted_price': float(row['predicted_price']) if row['predicted_price'] is not None else None
            })
        
        return jsonify({
            'status': 'success',
            'data': {
                'dept_id': dept_id,
                'date': date,
                'analysis': analysis,
                'total_days': len(analysis)
            }
        })
        
    except Exception as e:
        logger.error(f"Error in analysis: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Analysis failed: {str(e)}'
        }), 500

@app.route('/save-prediction', methods=['POST'])
def save_prediction():
    """
    Save a prediction result to MongoDB
    Expected JSON:
    {
        "days_to_expiry": 5,
        "dept_id": "FOODS_1",
        "date": "2024-01-15",
        "city": "CA_1"
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'status': 'error', 'message': 'No data provided'}), 400
        days_to_expiry = int(data['days_to_expiry'])
        dept_id = data['dept_id']
        date = data.get('date', datetime.now().strftime('%Y-%m-%d'))
        city = data.get('city', None)  # Optional city parameter
        
        # Prepare prediction parameters
        prediction_params = {
            'days_to_expiry': days_to_expiry,
            'dept_id': dept_id,
            'date': date
        }
        
        # Add city if provided
        if city:
            prediction_params['city'] = city
        
        # Predict
        result = predictor.predict_single(**prediction_params)
        predicted_price = result['predicted_price'].iloc[0]
        
        # Prepare document
        doc = {
            'days_to_expiry': days_to_expiry,
            'dept_id': dept_id,
            'date': date,
            'predicted_price': float(predicted_price),
            'timestamp': datetime.now()
        }
        
        # Add city to document if provided
        if city:
            doc['city'] = city
        
        # Insert into MongoDB
        mongo.db.predictions.insert_one(doc)
        return jsonify({'status': 'success', 'data': doc})
    except Exception as e:
        logger.error(f"Error saving prediction: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict_for_backend():
    """
    Unified prediction endpoint for Node.js backend.
    Expects:
    {
      "categoryId": "FOODS_1_001",
      "cityId": "CA_1",
      "mrp": 99.99,
      "dateAdded": "2024-01-15T10:30:00.000Z",
      "expiryDate": "2024-01-22T10:30:00.000Z",
      "weight": 500,
      "stock": 100,
      "productType": "grocery",
      "brandName": "Organic Brand",
      "unit": "grams"
    }
    """
    try:
        data = request.get_json()
        # Extract department from categoryId (e.g., FOODS_1_001 -> FOODS_1)
        category_id = data.get('categoryId', '')
        dept_id = '_'.join(category_id.split('_')[:2]) if category_id else None
        city = data.get('cityId')
        mrp = float(data.get('mrp', 0))
        date_added = data.get('dateAdded')
        expiry_date = data.get('expiryDate')
        weight = float(data.get('weight', 0)) if data.get('weight') is not None else None
        stock = int(data.get('stock', 0)) if data.get('stock') is not None else None
        unit = data.get('unit', 'grams')
        brand = data.get('brandName', '')
        # Calculate days_to_expiry
        from datetime import datetime
        d1 = datetime.fromisoformat(date_added.replace('Z', '')) if date_added else None
        d2 = datetime.fromisoformat(expiry_date.replace('Z', '')) if expiry_date else None
        days_to_expiry = (d2 - d1).days if d1 and d2 else None
        # Prepare features for model
        prediction = predictor.predict_single(
            days_to_expiry=days_to_expiry,
            dept_id=dept_id,
            date=date_added,
            city=city,
            mrp=mrp,
            weight=weight,
            stock=stock,
            unit=unit,
            brand=brand
        )
        predicted_price = prediction['predicted_price'].iloc[0]
        # Dummy demandScore/seasonality for now
        return jsonify({
            "bestPrice": float(predicted_price) if predicted_price is not None else None,
            "demandScore": 0.85,
            "seasonality": "year-round",
            "marketTrend": "stable"
        })
    except Exception as e:
        logger.error(f"Error in /predict: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 