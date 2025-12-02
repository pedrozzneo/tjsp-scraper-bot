# Julgados Automation

A desktop application for automating the download of legal documents from TJSP using Selenium web scraping with an Electron-based user interface.

## Overview
This project automates the process of downloading legal documents (julgados) from the TJSP website. It features a Python backend using Selenium for web scraping and an Electron desktop frontend for an intuitive user experience.

## Project Structure
```
JulgadosAutomation/
├── backend/
│   ├── __init__.py         # Package marker
│   ├── app.py              # Main scraping logic with CLI support
│   ├── driver.py           # Selenium WebDriver setup
│   ├── form.py             # Form filling utilities
│   ├── link.py             # Download link handling
│   ├── files.py            # File operations
│   └── error.py            # Error logging
├── frontend/
│   ├── index.html          # Main UI
│   ├── styles.css          # Styling
│   ├── renderer.js         # Frontend logic
│   └── preload.js          # Electron preload script
├── Keys/
│   └── key.py              # API keys (if needed)
├── main.js                 # Electron main process
├── package.json            # Node.js dependencies
├── requirements.txt        # Python dependencies
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Features
- 🎯 **Single-class scraping**: Process one class type at a time for better control
- 📅 **Date range support**: Scrape documents across a custom date range
- 💻 **Desktop GUI**: Beautiful, modern Electron interface
- 📊 **Real-time progress**: Live output console showing scraping progress
- 🔄 **Error handling**: Automatic retry logic and error logging
- 📁 **Organized storage**: Automatic file organization by class, year, and month

## Setup Instructions

### Prerequisites
- **Python 3.8+**
- **Node.js 16+** and npm
- **Google Chrome** (for Selenium)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd JulgadosAutomation
```

### 2. Install Python Dependencies
```bash
pip install -r requirements.txt
```

This installs:
- `selenium` - Web automation framework
- `webdriver-manager` - Automatic ChromeDriver management

### 3. Install Node.js Dependencies
```bash
npm install
```

This installs:
- `electron` - Desktop application framework

## Usage

### Running the Desktop App
```bash
npm start
```

This will launch the Electron desktop application with a user-friendly interface.

### Using the GUI
1. **Select Class Type**: Choose from the dropdown menu
   - Ação Civil Pública
   - Ação Civil de Improbidade Administrativa
   - Ação Civil Coletiva
   - Ação Popular
   - Mandado de Segurança Coletivo
   - Usucapião

2. **Select Date Range**: Pick start and end dates

3. **Start Scraping**: Click the button and monitor progress in real-time

Files are temporarily downloaded to: `C:\Users\pedro\Documents\temp` and then automatically organized to: `C:\Users\pedro\Documents\sentences`

### Running Backend Directly (CLI)
You can also run the Python backend directly from the command line:

```bash
python backend/app.py --classe "Ação Civil Pública" --start-date "01/01/2025" --end-date "31/01/2025"
```

**CLI Options:**
- `--classe`: Class name (required)
- `--start-date`: Start date in DD/MM/YYYY format (required)
- `--end-date`: End date in DD/MM/YYYY format (required)
- `--download-dir`: Temporary download directory (default: `C:\Users\pedro\Documents\temp`)

## Development

### Development Mode
Run Electron with DevTools open:
```bash
npm run dev
```

### Project Architecture

**Backend (Python/Selenium)**
- `app.py`: Main entry point, accepts CLI arguments, orchestrates scraping
- `driver.py`: WebDriver initialization and management
- `form.py`: Form filling automation
- `link.py`: Download link detection and processing
- `files.py`: File management and organization
- `error.py`: Error logging and retry logic

**Frontend (Electron/JavaScript)**
- `main.js`: Electron main process, spawns Python subprocess
- `preload.js`: Secure bridge between main and renderer processes
- `renderer.js`: UI logic and event handling
- `index.html` & `styles.css`: User interface

### How It Works
1. User fills out the form in the Electron GUI
2. Frontend sends data to main process via IPC
3. Main process spawns Python subprocess with arguments
4. Python script runs Selenium automation
5. Output streams back to GUI in real-time
6. Files are automatically organized upon completion

## Troubleshooting

### Python not found
Make sure Python is in your PATH. Try `python --version` or `python3 --version`.

### ChromeDriver issues
The `webdriver-manager` package should handle this automatically. If issues persist, manually download ChromeDriver matching your Chrome version.

### Permission errors
Ensure you have write permissions to the download directory.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for suggestions.

## License
This project is licensed under the MIT License.