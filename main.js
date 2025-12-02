const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'frontend', 'preload.js')
    }
  });

  mainWindow.loadFile('frontend/index.html');

  // Open DevTools in development mode
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle scraping request from renderer process
ipcMain.on('start-scraping', (event, data) => {
  const { classe, startDate, endDate, downloadDir } = data;

  console.log('Starting scraper with:', { classe, startDate, endDate, downloadDir });

  // Check if temp directory exists, create if it doesn't
  if (!fs.existsSync(downloadDir)) {
    try {
      fs.mkdirSync(downloadDir, { recursive: true });
      console.log(`Created temp directory: ${downloadDir}`);
    } catch (err) {
      console.error('Failed to create temp directory:', err);
      event.reply('scraping-status', {
        type: 'error',
        message: `Failed to create temp directory: ${err.message}`
      });
      return;
    }
  }

  // Construct Python command
  const pythonScript = path.join(__dirname, 'backend', 'app.py');
  const args = [
    pythonScript,
    '--classe', classe,
    '--start-date', startDate,
    '--end-date', endDate,
    '--download-dir', downloadDir
  ];

  console.log('Running command:', 'python', args.join(' '));

  // Spawn Python process with UTF-8 encoding
  const pythonProcess = spawn('python', args, {
    env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
  });

  // Send initial status
  event.reply('scraping-status', {
    type: 'started',
    message: `Started scraping ${classe} from ${startDate} to ${endDate}`
  });

  // Handle Python stdout
  pythonProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('Python output:', output);
    
    event.reply('scraping-status', {
      type: 'progress',
      message: output
    });
  });

  // Handle Python stderr
  pythonProcess.stderr.on('data', (data) => {
    const error = data.toString();
    console.error('Python error:', error);
    
    event.reply('scraping-status', {
      type: 'error',
      message: error
    });
  });

  // Handle process completion
  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
    
    if (code === 0) {
      event.reply('scraping-status', {
        type: 'completed',
        message: 'Scraping completed successfully!'
      });
    } else {
      event.reply('scraping-status', {
        type: 'error',
        message: `Scraping failed with exit code ${code}`
      });
    }
  });

  // Handle process errors
  pythonProcess.on('error', (error) => {
    console.error('Failed to start Python process:', error);
    
    event.reply('scraping-status', {
      type: 'error',
      message: `Failed to start scraper: ${error.message}`
    });
  });
});

