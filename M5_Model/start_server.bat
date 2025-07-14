@echo off
echo ========================================
echo    M5 Expiry Price Predictor
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

echo Python found. Checking dependencies...

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

REM Check if model files exist
echo Checking model files...
if not exist "Model\model_FOODS_1_optimized.pkl" (
    echo ERROR: Model files are missing
    echo Please ensure all model files are in the Model\ directory
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Starting Server...
echo ========================================
echo.
echo Web Interface: http://localhost:5000
echo API Endpoints: http://localhost:5000/
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
python start_server.py

pause 