#!/bin/bash
# Script to set up Python 3.11 virtual environment for Global Wellness Assistant

echo "Setting up Python 3.11 virtual environment..."

# Check if Python 3.11 is available
if ! command -v python3.11 &> /dev/null; then
    echo "Error: Python 3.11 is not installed or not in PATH"
    echo "Please install Python 3.11 first: brew install python@3.11"
    exit 1
fi

# Deactivate current virtual environment if active
if [ -n "$VIRTUAL_ENV" ]; then
    echo "Deactivating current virtual environment..."
    deactivate
fi

# Backup old venv if it exists
if [ -d "venv" ]; then
    echo "Backing up old virtual environment to venv_backup..."
    mv venv venv_backup_$(date +%Y%m%d_%H%M%S)
fi

# Create new virtual environment with Python 3.11
echo "Creating new virtual environment with Python 3.11..."
python3.11 -m venv venv

# Activate the new virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Verify Python version
echo "Verifying Python version..."
python --version

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "✅ Setup complete!"
echo "To activate this environment in the future, run:"
echo "  source venv/bin/activate"

