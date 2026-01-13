#!/bin/bash

# Or-Bo PWS Weather Dashboard - Quick Start Script
# This script starts the weather dashboard server

echo "🌤️  Starting Or-Bo PWS Weather Dashboard..."
echo ""

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Get the port (default to 8000)
PORT=${1:-8000}

echo "📡 Starting server on port $PORT..."
echo "🌐 Dashboard will be available at: http://localhost:$PORT"
echo ""
echo "📝 Quick tips:"
echo "   - Press Ctrl+C to stop the server"
echo "   - Edit app.js to configure your weather station API"
echo "   - Check CONFIGURATION.md for setup instructions"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the Python HTTP server
python3 -m http.server $PORT
