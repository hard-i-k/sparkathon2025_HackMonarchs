#!/usr/bin/env python3
"""
Test MongoDB connection and Flask app startup
"""

import sys
import os

print(f"Python executable: {sys.executable}")
print(f"Current directory: {os.getcwd()}")

# Test imports
try:
    from flask import Flask
    print("✅ Flask imported")
except ImportError as e:
    print(f"❌ Flask import failed: {e}")
    sys.exit(1)

try:
    from flask_pymongo import PyMongo
    print("✅ flask_pymongo imported")
except ImportError as e:
    print(f"❌ flask_pymongo import failed: {e}")
    print("Installing flask_pymongo...")
    import subprocess
    subprocess.run([sys.executable, "-m", "pip", "install", "flask-pymongo", "pymongo"])
    try:
        from flask_pymongo import PyMongo
        print("✅ flask_pymongo imported after installation")
    except ImportError as e:
        print(f"❌ flask_pymongo still failed: {e}")
        sys.exit(1)

try:
    import pymongo
    print("✅ pymongo imported")
except ImportError as e:
    print(f"❌ pymongo import failed: {e}")

# Test Flask app creation
try:
    app = Flask(__name__)
    app.config["MONGO_URI"] = "mongodb://localhost:27017/m5_predictions"
    mongo = PyMongo(app)
    print("✅ Flask app with MongoDB created successfully")
except Exception as e:
    print(f"❌ Flask app creation failed: {e}")

print("✅ All tests passed!") 