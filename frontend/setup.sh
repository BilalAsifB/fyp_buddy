#!/bin/bash

# FYP Frontend Setup Script
echo "🚀 Setting up FYP Student Matching Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'.' -f1 | cut -d'v' -f2)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Create React app with TypeScript
echo "📦 Creating React app with TypeScript..."
npx create-react-app . --template typescript

# Install additional dependencies
echo "📦 Installing additional dependencies..."
npm install axios react-hook-form @hookform/resolvers zod lucide-react react-hot-toast

# Install dev dependencies
echo "📦 Installing development dependencies..."
npm install -D tailwindcss postcss autoprefixer @types/node

# Initialize Tailwind CSS
echo "🎨 Setting up Tailwind CSS..."
npx tailwindcss init -p

# Copy environment file
echo "⚙️ Setting up environment configuration..."
cp .env.example .env.local

# Create initial directory structure
echo "📁 Creating directory structure..."
mkdir -p src/components/ui
mkdir -p src/components/forms
mkdir -p src/components/results
mkdir -p src/components/layout
mkdir -p src/components/common
mkdir -p src/services
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/styles

echo "✅ Setup complete! 🎉"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your backend URL"
echo "2. Run 'npm start' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Make sure your FastAPI backend is running on http://localhost:8000"