#!/bin/bash

echo "🚀 Setting up Market Intelligence Agent..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating one from template..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your API keys."
    echo ""
    echo "📝 You need to add the following API keys to .env:"
    echo "   1. OPENAI_API_KEY - Get from https://platform.openai.com/api-keys"
    echo "   2. FIRECRAWL_API_KEY - Get from https://www.firecrawl.dev/"
    echo "   3. SCRAPINGDOG_API_KEY - Get from https://scrapingdog.com/"
    echo ""
else
    echo "✅ .env file already exists."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Edit .env file with your API keys"
echo "2. Run: npm start (for backend)"
echo "3. In another terminal, run: cd frontend && npm run dev (for frontend)"
echo ""
echo "Then open http://localhost:5173 in your browser"