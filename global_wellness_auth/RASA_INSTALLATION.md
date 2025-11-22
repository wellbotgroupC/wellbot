# Rasa Installation Guide

## Python Version Compatibility

**Important**: Rasa 3.x requires Python 3.8, 3.9, 3.10, or 3.11. It does not currently support Python 3.12 or 3.13.

## Solution Options

### Option 1: Use Python 3.11 (Recommended)

Create a separate virtual environment with Python 3.11 for Rasa:

```bash
# Install Python 3.11 (if not already installed)
# On macOS with Homebrew:
brew install python@3.11

# Create a new virtual environment with Python 3.11
python3.11 -m venv venv_rasa
source venv_rasa/bin/activate

# Install Rasa in this environment
pip install rasa>=3.0.0,<4.0.0
pip install rasa-sdk>=3.0.0,<4.0.0
```

Then run Rasa from this environment while keeping Flask in your main environment.

### Option 2: Use Python 3.11 for the Entire Project

Recreate your virtual environment with Python 3.11:

```bash
# Deactivate current environment
deactivate

# Remove old venv (optional)
rm -rf venv

# Create new venv with Python 3.11
python3.11 -m venv venv
source venv/bin/activate

# Install all dependencies
pip install -r requirements.txt
```

### Option 3: Install Rasa Manually (If Available)

Try installing the latest compatible version:

```bash
pip install rasa --upgrade
pip install rasa-sdk --upgrade
```

If this fails, you'll need to use Python 3.11.

## Verify Installation

After installation, verify Rasa is working:

```bash
rasa --version
```

You should see something like: `Rasa Version 3.x.x`

## Running the Project

Once Rasa is installed:

1. **Train the model** (in `rasa_bot/` directory):
   ```bash
   cd rasa_bot
   rasa train
   ```

2. **Run Rasa server** (in one terminal):
   ```bash
   cd rasa_bot
   rasa run --enable-api --cors "*" --port 5005
   ```

3. **Run Flask app** (in another terminal):
   ```bash
   flask --app app:create_app run
   ```

## Troubleshooting

If you continue to have issues:

1. Check your Python version: `python --version`
2. Ensure you're using Python 3.8-3.11
3. Try installing Rasa without version constraints: `pip install rasa`
4. Check Rasa's official documentation for the latest compatibility information

