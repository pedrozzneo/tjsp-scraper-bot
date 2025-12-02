# Quick Setup Guide

## First Time Setup

### Step 1: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Install Node.js Dependencies
```bash
npm install
```

This will download Electron and other necessary packages (may take a few minutes).

## Running the Application

### Option 1: Desktop App (Recommended)
```bash
npm start
```

### Option 2: Development Mode (with DevTools)
```bash
npm run dev
```

### Option 3: Command Line Only
```bash
python backend/app.py --classe "Ação Civil Pública" --start-date "01/12/2025" --end-date "05/12/2025"
```

## Expected Behavior

1. **First Run**: The app will download ChromeDriver automatically
2. **Chrome Window**: A Chrome browser window will open and navigate to TJSP
3. **Automation**: Forms will be filled automatically
4. **Downloads**: PDFs will be downloaded to the specified directory
5. **Organization**: Files will be moved to organized folders by class/year/month

## Default Paths

- **Temporary Download Directory**: `C:\Users\pedro\Documents\temp`
- **Final Storage**: `C:\Users\pedro\Documents\sentences\[Class]\[Year]\[Month]\[Date]`

Note: Files are first downloaded to the temp directory, then automatically moved to their final organized location.

## Troubleshooting

### "Python not found"
- Windows: Add Python to PATH during installation
- Or use full path: `C:\Python39\python.exe backend/app.py ...`

### "npm: command not found"
- Install Node.js from https://nodejs.org/

### Chrome issues
- Make sure Google Chrome is installed
- The script uses webdriver-manager to auto-download the correct driver

### Permission errors
- Run terminal as Administrator (Windows)
- Check write permissions for download directories
- Ensure `C:\Users\pedro\Documents\temp` folder exists

## Next Steps

1. Test with a small date range first (1-2 days)
2. Monitor the output console for any errors
3. Check that files are being organized correctly
4. Expand date range as needed

## Support

Check the main README.md for more detailed documentation.

