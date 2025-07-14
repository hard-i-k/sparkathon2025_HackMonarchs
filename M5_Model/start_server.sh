#!/bin/bash

echo "========================================"
echo "    M5 Expiry Price Predictor"
echo "========================================"
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

echo "Python found. Checking dependencies..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to create virtual environment"
        exit 1
    fi
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

# Check if model files exist
echo "Checking model files..."
if [ ! -f "Model/model_FOODS_1_optimized.pkl" ]; then
    echo "ERROR: Model files are missing"
    echo "Please ensure all model files are in the Model/ directory"
    exit 1
fi

echo
echo "========================================"
echo "    Starting Server..."
echo "========================================"
echo
echo "Web Interface: http://localhost:5000"
echo "API Endpoints: http://localhost:5000/"
echo
echo "Press Ctrl+C to stop the server"
echo

# Start the server
python start_server.py 