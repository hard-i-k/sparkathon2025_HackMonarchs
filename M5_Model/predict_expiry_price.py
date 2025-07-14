import pandas as pd
import numpy as np
import pickle
import joblib
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class ExpiryPricePredictor:
    """
    M5 Forecasting Model for predicting prices based on expiry dates
    Supports FOODS_1, FOODS_2, FOODS_3 categories
    """
    
    def __init__(self, model_dir='Model/'):
        """
        Initialize the predictor with trained models
        
        Args:
            model_dir (str): Directory containing model files
        """
        self.model_dir = model_dir
        self.models = {}
        self.scalers = {}
        self.departments = ['FOODS_1', 'FOODS_2', 'FOODS_3']
        
        # Load all models and scalers
        self._load_models()
        
    def _load_models(self):
        """Load all trained models and scalers"""
        try:
            for dept in self.departments:
                # Load model
                model_path = f"{self.model_dir}model_{dept}_optimized.pkl"
                with open(model_path, 'rb') as f:
                    self.models[dept] = pickle.load(f)
                
                # Load scaler
                scaler_path = f"{self.model_dir}scaler_{dept}_optimized.pkl"
                with open(scaler_path, 'rb') as f:
                    self.scalers[dept] = pickle.load(f)
                    
            print(f"✅ Successfully loaded {len(self.models)} models")
            
        except Exception as e:
            print(f"❌ Error loading models: {str(e)}")
            raise
    
    def _create_features(self, data):
        """
        Create features for prediction
        
        Args:
            data (pd.DataFrame): Input data with required columns
            
        Returns:
            pd.DataFrame: Feature matrix
        """
        # Ensure required columns exist
        required_cols = ['days_to_expiry', 'dept_id', 'date']
        missing_cols = [col for col in required_cols if col not in data.columns]
        if missing_cols:
            raise ValueError(f"Missing required columns: {missing_cols}")
        
        # Create feature dataframe
        features_df = data.copy()
        
        # Date features
        features_df['date'] = pd.to_datetime(features_df['date'])
        features_df['year'] = features_df['date'].dt.year
        features_df['month'] = features_df['date'].dt.month
        features_df['day'] = features_df['date'].dt.day
        features_df['day_of_week'] = features_df['date'].dt.dayofweek
        features_df['week_of_year'] = features_df['date'].dt.isocalendar().week
        
        # Days to expiry features
        features_df['days_to_expiry_squared'] = features_df['days_to_expiry'] ** 2
        features_df['days_to_expiry_cubed'] = features_df['days_to_expiry'] ** 3
        features_df['log_days_to_expiry'] = np.log1p(features_df['days_to_expiry'])
        
        # Department encoding
        for dept in self.departments:
            features_df[f'dept_{dept}'] = (features_df['dept_id'] == dept).astype(int)
        
        # City encoding (if city column exists) - but don't use in prediction
        if 'city' in features_df.columns:
            # Store city info for response but don't use in model features
            features_df['_city_info'] = features_df['city']
            # Remove city column to avoid feature mismatch
            features_df = features_df.drop('city', axis=1)
        
        # Default values for missing features (set to 0 for simplicity)
        default_features = {
            'days_since_first_sale': 0,
            'has_event': 0,
            'promo_impact': 0,
            'price_diff': 0,
            'price_trend': 0,
            'price_elasticity': 0,
            'sales_lag_1': 0,
            'stock_turnover': 0,
            'expiry_price_elasticity': 0,
            'days_to_expiry_price_elasticity': 0,
            'days_to_expiry_price_trend': 0,
            'price_elasticity_trend_interaction': 0,
            'sell_price_lag_7': 0,
            'days_to_expiry_sales_interaction': 0
        }
        
        for feature, default_value in default_features.items():
            if feature not in features_df.columns:
                features_df[feature] = default_value
        
        return features_df
    
    def _get_feature_columns(self):
        """Get the list of feature columns used by the models"""
        # Only return features that were used during model training
        return [
            'days_to_expiry', 'days_to_expiry_squared', 'days_to_expiry_cubed', 'log_days_to_expiry',
            'days_since_first_sale', 'day_of_week', 'week_of_year', 'month', 'has_event', 'promo_impact',
            'price_diff', 'price_trend', 'price_elasticity', 'sales_lag_1', 'stock_turnover',
            'expiry_price_elasticity', 'days_to_expiry_price_elasticity', 'days_to_expiry_price_trend',
            'price_elasticity_trend_interaction', 'sell_price_lag_7', 'days_to_expiry_sales_interaction',
            'dept_FOODS_1', 'dept_FOODS_2', 'dept_FOODS_3'
        ]
    
    def predict_single(self, days_to_expiry, dept_id, date=None, **kwargs):
        """
        Predict price for a single item
        
        Args:
            days_to_expiry (int): Days until expiry
            dept_id (str): Department ID (FOODS_1, FOODS_2, FOODS_3)
            date (str/datetime): Date for prediction
            **kwargs: Additional features
            
        Returns:
            float: Predicted price
        """
        if date is None:
            date = datetime.now()
        
        # Create input data
        data = pd.DataFrame({
            'days_to_expiry': [days_to_expiry],
            'dept_id': [dept_id],
            'date': [date]
        })
        
        # Add additional features
        for key, value in kwargs.items():
            data[key] = value
        
        return self.predict_batch(data)
    
    def predict_batch(self, data):
        """
        Predict prices for multiple items
        
        Args:
            data (pd.DataFrame): DataFrame with columns: days_to_expiry, dept_id, date
            
        Returns:
            pd.DataFrame: Original data with predicted prices
        """
        if data.empty:
            return data
        
        # Create features
        features_df = self._create_features(data)
        feature_cols = self._get_feature_columns()
        
        # Ensure all feature columns exist
        for col in feature_cols:
            if col not in features_df.columns:
                features_df[col] = 0
        
        # Select only the required features
        X = features_df[feature_cols]
        
        # Make predictions for each department
        predictions = []
        
        for idx, row in features_df.iterrows():
            dept = row['dept_id']
            
            if dept not in self.models:
                print(f"⚠️ Warning: No model found for department {dept}")
                predictions.append(None)
                continue
            
            # Get features for this row
            row_features = X.iloc[idx:idx+1]
            
            # Scale features
            numerical_features = [
                'days_to_expiry', 'days_to_expiry_squared', 'days_to_expiry_cubed', 'log_days_to_expiry',
                'days_since_first_sale', 'price_diff', 'price_trend', 'price_elasticity',
                'sales_lag_1', 'stock_turnover', 'expiry_price_elasticity',
                'days_to_expiry_price_elasticity', 'days_to_expiry_price_trend',
                'price_elasticity_trend_interaction', 'sell_price_lag_7', 'days_to_expiry_sales_interaction'
            ]
            
            # Scale numerical features
            row_features_scaled = row_features.copy()
            if dept in self.scalers:
                row_features_scaled[numerical_features] = self.scalers[dept].transform(
                    row_features[numerical_features]
                )
            
            # Make prediction
            try:
                pred = self.models[dept].predict(row_features_scaled)[0]
                predictions.append(pred)
            except Exception as e:
                print(f"❌ Error predicting for {dept}: {str(e)}")
                predictions.append(None)
        
        # Add predictions to original data
        result = data.copy()
        result['predicted_price'] = predictions
        
        # Add city info back if it exists
        if '_city_info' in features_df.columns:
            result['city'] = features_df['_city_info']
        
        return result
    
    def get_model_info(self):
        """Get information about loaded models"""
        info = {
            'loaded_models': list(self.models.keys()),
            'model_count': len(self.models),
            'scaler_count': len(self.scalers),
            'supported_departments': self.departments
        }
        return info

# Example usage and testing
if __name__ == "__main__":
    # Initialize predictor
    predictor = ExpiryPricePredictor()
    
    # Test single prediction
    print("\n🧪 Testing single prediction:")
    pred = predictor.predict_single(
        days_to_expiry=5,
        dept_id='FOODS_1',
        date='2024-01-15'
    )
    print(f"Predicted price: ${pred['predicted_price'].iloc[0]:.2f}")
    
    # Test batch prediction
    print("\n🧪 Testing batch prediction:")
    test_data = pd.DataFrame({
        'days_to_expiry': [3, 7, 10, 15],
        'dept_id': ['FOODS_1', 'FOODS_2', 'FOODS_3', 'FOODS_1'],
        'date': ['2024-01-15', '2024-01-15', '2024-01-15', '2024-01-15']
    })
    
    results = predictor.predict_batch(test_data)
    print("\nBatch Prediction Results:")
    print(results[['days_to_expiry', 'dept_id', 'predicted_price']])
    
    # Model info
    print("\n📊 Model Information:")
    info = predictor.get_model_info()
    for key, value in info.items():
        print(f"{key}: {value}") 