#!/usr/bin/env python3
"""
M5 Expiry Price Predictor - Server Starter Script
This script sets up the environment and starts the Flask API server.
"""

import os
import sys
import subprocess
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        logger.error("❌ Python 3.8 or higher is required")
        logger.info(f"Current version: {sys.version}")
        return False
    logger.info(f"✅ Python version: {sys.version.split()[0]}")
    return True

def check_dependencies():
    """Check if required dependencies are installed"""
    required_packages = [
        'pandas', 'numpy', 'sklearn', 'xgboost', 
        'flask', 'flask_cors', 'joblib'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
            logger.info(f"✅ {package} is installed")
        except ImportError:
            missing_packages.append(package)
            logger.warning(f"⚠️ {package} is missing")
    
    if missing_packages:
        logger.error(f"❌ Missing packages: {', '.join(missing_packages)}")
        logger.info("💡 Run: pip install -r requirements.txt")
        return False
    
    return True

def check_model_files():
    """Check if model files exist"""
    model_dir = Path("Model")
    required_files = [
        "model_FOODS_1_optimized.pkl",
        "model_FOODS_2_optimized.pkl", 
        "model_FOODS_3_optimized.pkl",
        "scaler_FOODS_1_optimized.pkl",
        "scaler_FOODS_2_optimized.pkl",
        "scaler_FOODS_3_optimized.pkl"
    ]
    
    missing_files = []
    
    for file in required_files:
        file_path = model_dir / file
        if file_path.exists():
            logger.info(f"✅ {file} found")
        else:
            missing_files.append(file)
            logger.warning(f"⚠️ {file} missing")
    
    if missing_files:
        logger.error(f"❌ Missing model files: {', '.join(missing_files)}")
        logger.info("💡 Ensure all model files are in the Model/ directory")
        return False
    
    return True

def install_dependencies():
    """Install required dependencies"""
    logger.info("📦 Installing dependencies...")
    try:
        subprocess.run([
            sys.executable, "-m", "pip", "install", "-r", "requirements.txt"
        ], check=True)
        logger.info("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"❌ Failed to install dependencies: {e}")
        return False

def start_server():
    """Start the Flask server"""
    logger.info("🚀 Starting M5 Expiry Price Predictor server...")
    
    try:
        # Import and run the Flask app
        from app import app
        logger.info("✅ Server started successfully")
        logger.info("🌐 Web interface: http://localhost:5000")
        logger.info("📊 API documentation: http://localhost:5000/")
        logger.info("🛑 Press Ctrl+C to stop the server")
        
        app.run(debug=False, host='0.0.0.0', port=5000)
        
    except ImportError as e:
        logger.error(f"❌ Failed to import app: {e}")
        return False
    except Exception as e:
        logger.error(f"❌ Failed to start server: {e}")
        return False

def main():
    """Main function to set up and start the server"""
    logger.info("🍽️ M5 Expiry Price Predictor - Server Setup")
    logger.info("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Check dependencies
    if not check_dependencies():
        logger.info("🔄 Attempting to install dependencies...")
        if not install_dependencies():
            logger.error("❌ Failed to install dependencies. Please install manually:")
            logger.error("pip install -r requirements.txt")
            sys.exit(1)
    
    # Check model files
    if not check_model_files():
        logger.error("❌ Model files are missing. Please ensure all model files are present.")
        sys.exit(1)
    
    # Start server
    logger.info("=" * 50)
    start_server()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        logger.info("\n🛑 Server stopped by user")
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        sys.exit(1) 