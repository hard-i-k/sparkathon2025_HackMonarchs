@echo off
echo Activating virtual environment and starting Flask server...
echo.

cd /d "%~dp0"

echo Activating virtual environment...
call .venv\Scripts\activate.bat

echo Installing required packages...
python -m pip install flask-pymongo pymongo

echo.
echo Starting Flask server...
python app.py

pause 