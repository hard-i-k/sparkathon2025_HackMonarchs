@echo off
echo ========================================
echo M5 Expiry Price Prediction API
echo ========================================
echo.

echo Current directory: %CD%
echo Python executable: C:\Python313\python.exe
echo.

echo Installing required packages...
C:\Python313\python.exe -m pip install flask-pymongo pymongo requests

echo.
echo Testing imports...
C:\Python313\python.exe -c "from flask_pymongo import PyMongo; print('flask_pymongo OK')"

echo.
echo Starting Flask server...
echo Server will be available at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

C:\Python313\python.exe app.py

pause 