#!/usr/bin/env python3
"""
Comprehensive script to install dependencies and run Flask server
"""

import sys
import subprocess
import os
import time
import requests

def install_packages():
    """Install required packages"""
    print("📦 Installing required packages...")
    
    packages = [
        "flask-pymongo>=2.3.0",
        "pymongo>=4.0.0",
        "requests"
    ]
    
    for package in packages:
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", package], 
                         check=True, capture_output=True)
            print(f"✅ Installed {package}")
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install {package}: {e}")
            return False
    
    return True

def test_imports():
    """Test if all required modules can be imported"""
    print("🧪 Testing imports...")
    
    try:
        from flask import Flask
        print("✅ Flask imported")
    except ImportError as e:
        print(f"❌ Flask import failed: {e}")
        return False
    
    try:
        from flask_pymongo import PyMongo
        print("✅ flask_pymongo imported")
    except ImportError as e:
        print(f"❌ flask_pymongo import failed: {e}")
        return False
    
    try:
        import pymongo
        print("✅ pymongo imported")
    except ImportError as e:
        print(f"❌ pymongo import failed: {e}")
        return False
    
    return True

def start_server():
    """Start the Flask server"""
    print("🚀 Starting Flask server...")
    
    try:
        # Import and run the app
        from app import app
        print("✅ Flask app imported successfully")
        
        # Start the server in a separate process
        import threading
        def run_server():
            app.run(debug=False, host='0.0.0.0', port=5000)
        
        server_thread = threading.Thread(target=run_server, daemon=True)
        server_thread.start()
        
        # Wait for server to start
        print("⏳ Waiting for server to start...")
        time.sleep(5)
        
        # Test the server
        try:
            response = requests.get('http://localhost:5000/health', timeout=10)
            if response.status_code == 200:
                print("✅ Server is running successfully!")
                print(f"📊 Server response: {response.json()}")
                return True
            else:
                print(f"❌ Server responded with status {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            print(f"❌ Server test failed: {e}")
            return False
            
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        return False

def main():
    """Main function"""
    print("🎯 M5 Expiry Price Prediction - Installation and Startup")
    print("=" * 60)
    
    # Install packages
    if not install_packages():
        print("❌ Package installation failed")
        return
    
    # Test imports
    if not test_imports():
        print("❌ Import tests failed")
        return
    
    # Start server
    if not start_server():
        print("❌ Server startup failed")
        return
    
    print("\n🎉 All systems operational!")
    print("🌐 Server is running at: http://localhost:5000")
    print("📋 Available endpoints:")
    print("   - GET  /health")
    print("   - POST /predict/single")
    print("   - POST /predict/batch")
    print("   - POST /save-prediction")
    print("\nPress Ctrl+C to stop the server")

if __name__ == "__main__":
    main() 