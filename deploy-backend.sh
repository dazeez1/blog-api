#!/bin/bash

echo "🚀 Deploying BlogHub Backend to Render..."

# Navigate to backend directory
cd backend

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the backend directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests to ensure everything works
echo "🧪 Running tests..."
npm test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix the issues before deploying."
    exit 1
fi

echo "✅ Tests passed!"

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo "📥 Installing Render CLI..."
    curl -sL https://render.com/download-cli/install.sh | bash
fi

# Deploy to Render
echo "🚀 Deploying to Render..."
render deploy

echo "✅ Deployment initiated! Check your Render dashboard for status."
echo "🌐 Your backend will be available at: https://bloghub-backend.onrender.com"
