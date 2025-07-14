# 🍽️ M5 Expiry Price Predictor

An AI-powered system for predicting food item prices based on expiry dates using the M5 Forecasting Challenge dataset.

## 📋 Overview

This project uses machine learning models to predict prices of food items based on their days to expiry. It supports three food categories:
- **FOODS_1**: Perishable food items
- **FOODS_2**: Semi-perishable food items  
- **FOODS_3**: Non-perishable food items

## 🚀 Features

- **Single Prediction**: Predict price for individual items
- **Batch Prediction**: Predict prices for multiple items at once
- **Price Analysis**: Analyze price trends across different expiry days
- **REST API**: Easy-to-use API endpoints
- **Web Interface**: Beautiful and intuitive web UI
- **Multiple Models**: Separate optimized models for each food category

## 📁 Project Structure

```
M5_Model/
├── Model/                          # Trained model files
│   ├── model_FOODS_1_optimized.pkl
│   ├── model_FOODS_2_optimized.pkl
│   ├── model_FOODS_3_optimized.pkl
│   ├── scaler_FOODS_1_optimized.pkl
│   ├── scaler_FOODS_2_optimized.pkl
│   └── scaler_FOODS_3_optimized.pkl
├── templates/                      # Web interface
│   └── index.html
├── predict_expiry_price.py        # Main prediction class
├── app.py                         # Flask API server
├── requirements.txt               # Python dependencies
├── README.md                     # This file
└── expirymodel.ipynb            # Original Jupyter notebook
```

## 🛠️ Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Setup Instructions

1. **Clone or download the project**
   ```bash
   # If you have the project files, navigate to the M5_Model directory
   cd M5_Model
   ```

2. **Create a virtual environment (recommended)**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Verify installation**
   ```bash
   python predict_expiry_price.py
   ```

## 🚀 Usage

### Method 1: Python Script

```python
from predict_expiry_price import ExpiryPricePredictor

# Initialize predictor
predictor = ExpiryPricePredictor()

# Single prediction
result = predictor.predict_single(
    days_to_expiry=5,
    dept_id='FOODS_1',
    date='2024-01-15'
)
print(f"Predicted price: ${result['predicted_price'].iloc[0]:.2f}")

# Batch prediction
import pandas as pd
data = pd.DataFrame({
    'days_to_expiry': [3, 7, 10],
    'dept_id': ['FOODS_1', 'FOODS_2', 'FOODS_3'],
    'date': ['2024-01-15', '2024-01-15', '2024-01-15']
})
results = predictor.predict_batch(data)
print(results)
```

### Method 2: Web API

1. **Start the Flask server**
   ```bash
   python app.py
   ```

2. **Access the web interface**
   - Open your browser and go to: `http://localhost:5000`
   - Use the intuitive web interface for predictions

3. **API Endpoints**
   - `GET /` - API information
   - `GET /health` - Health check
   - `GET /model/info` - Model information
   - `POST /predict/single` - Single prediction
   - `POST /predict/batch` - Batch prediction
   - `POST /predict/analysis` - Price analysis

### API Examples

**Single Prediction:**
```bash
curl -X POST http://localhost:5000/predict/single \
  -H "Content-Type: application/json" \
  -d '{
    "days_to_expiry": 5,
    "dept_id": "FOODS_1",
    "date": "2024-01-15"
  }'
```

**Batch Prediction:**
```bash
curl -X POST http://localhost:5000/predict/batch \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

**Price Analysis:**
```bash
curl -X POST http://localhost:5000/predict/analysis \
  -H "Content-Type: application/json" \
  -d '{
    "dept_id": "FOODS_1",
    "date": "2024-01-15",
    "max_days": 30
  }'
```

## 📊 Model Information

### Features Used
- **Days to Expiry**: Primary feature for price prediction
- **Date Features**: Year, month, day, day of week, week of year
- **Department Encoding**: One-hot encoding for FOODS_1, FOODS_2, FOODS_3
- **Derived Features**: Squared, cubed, and logarithmic transformations
- **Additional Features**: Sales trends, price elasticity, promotional impact

### Model Performance
- **Algorithm**: XGBoost Regressor
- **Optimization**: GridSearchCV with cross-validation
- **Scaling**: RobustScaler for numerical features
- **R² Score**: 0.06-0.12 (log-transformed prices)

## 🔧 Configuration

### Model Directory
By default, models are loaded from the `Model/` directory. You can change this:

```python
predictor = ExpiryPricePredictor(model_dir='path/to/models/')
```

### API Configuration
Edit `app.py` to change server settings:

```python
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

## 🐛 Troubleshooting

### Common Issues

1. **Model Loading Error**
   ```
   ❌ Error loading models: [Errno 2] No such file or directory
   ```
   **Solution**: Ensure all model files are in the `Model/` directory

2. **Import Error**
   ```
   ModuleNotFoundError: No module named 'xgboost'
   ```
   **Solution**: Install dependencies with `pip install -r requirements.txt`

3. **Port Already in Use**
   ```
   OSError: [Errno 98] Address already in use
   ```
   **Solution**: Change port in `app.py` or kill existing process

4. **CORS Error (Frontend)**
   ```
   Access to fetch at 'http://localhost:5000' from origin has been blocked
   ```
   **Solution**: CORS is already enabled in the API

### Debug Mode
Enable debug logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📈 Future Enhancements

- [ ] Real-time data integration
- [ ] Additional food categories
- [ ] Advanced visualization dashboard
- [ ] Model retraining pipeline
- [ ] Mobile app integration
- [ ] Database integration for predictions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for educational and research purposes.

## 📞 Support

For questions or issues:
1. Check the troubleshooting section
2. Review the API documentation
3. Test with the provided examples

---

**Note**: This project uses pre-trained models. For production use, consider retraining with your specific data and requirements. 