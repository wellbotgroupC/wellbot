#!/bin/bash
# Quick setup script for Python 3.10 virtual environment

echo "🔍 Checking Python 3.10..."
if ! command -v python3.10 &> /dev/null; then
    echo "❌ Python 3.10 not found. Please install it first:"
    echo "   brew install python@3.10"
    exit 1
fi

echo "✅ Python 3.10 found: $(python3.10 --version)"

# Deactivate if in a venv
if [ -n "$VIRTUAL_ENV" ]; then
    echo "📦 Deactivating current virtual environment..."
    deactivate 2>/dev/null || true
fi

# Remove old venv if exists
if [ -d "venv" ]; then
    echo "🗑️  Removing old virtual environment..."
    rm -rf venv
fi

# Create new venv with Python 3.10
echo "🆕 Creating new virtual environment with Python 3.10..."
python3.10 -m venv venv

# Activate
echo "✅ Activating virtual environment..."
source venv/bin/activate

# Verify
echo "🔍 Verifying Python version in venv:"
python --version

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip --quiet

# Install dependencies
echo "📦 Installing dependencies (this may take a few minutes)..."
pip install -r requirements.txt

echo ""
echo "✅ Setup complete!"
echo ""
echo "To activate this environment in the future, run:"
echo "   source venv/bin/activate"
echo ""
echo "Then verify Rasa installation:"
echo "   rasa --version"
