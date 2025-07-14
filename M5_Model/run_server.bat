@echo off
echo Starting M5 Expiry Price Prediction API...
echo Using Python: C:\Python313\python.exe
echo.

cd /d "%~dp0"
C:\Python313\python.exe -c "import flask_pymongo; print('flask_pymongo available')"
if %errorlevel% neq 0 (
    echo Installing flask_pymongo...
    C:\Python313\python.exe -m pip install flask-pymongo pymongo
)

echo.
echo Starting Flask server...
C:\Python313\python.exe app.py
pause 