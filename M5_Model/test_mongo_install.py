#!/usr/bin/env python3
"""
Test script to verify MongoDB packages installation
"""

import sys
print(f"Python version: {sys.version}")
print(f"Python executable: {sys.executable}")

try:
    import flask_pymongo
    print("✅ flask_pymongo imported successfully")
except ImportError as e:
    print(f"❌ flask_pymongo import failed: {e}")

try:
    import pymongo
    print("✅ pymongo imported successfully")
except ImportError as e:
    print(f"❌ pymongo import failed: {e}")

try:
    from flask import Flask
    print("✅ Flask imported successfully")
except ImportError as e:
    print(f"❌ Flask import failed: {e}")

print("Test completed!") 