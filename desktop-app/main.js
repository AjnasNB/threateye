const { app, BrowserWindow, Menu, Tray, ipcMain, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const screenshot = require('screenshot-desktop');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const log = require('electron-log');
const Store = require('electron-store');

// Configure logging
log.transports.file.level = 'info';
log.info('Application starting...');

// Initialize the settings store
const store = new Store({
  name: 'threateye-settings',
  defaults: {
    apiKey: '',
    serverUrl: 'http://localhost:3000',
    captureInterval: 30,
    startOnLaunch: false,
    enableNotifications: true
  }
});

// Global variables
let mainWindow = null;
let tray = null;
let isMonitoring = false;
let monitoringInterval = null;
let isQuitting = false;

// Create temp directory for screenshots
const tempDir = path.join(app.getPath('userData'), 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      devTools: process.env.NODE_ENV === 'development' || process.argv.includes('--dev')
    },
    backgroundColor: '#f3f4f6',
    title: 'ThreatEye Desktop'
  });

  // Load the index.html file
  mainWindow.loadFile('index.html');

  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development' || process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window close event
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
  });

  // Handle window closed event
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create system tray
  createTray();
}

function createTray() {
  try {
    // Create a dummy 16x16 transparent icon if none exists
    const iconPath = path.join(__dirname, 'icons', 'icon.png');
    let icon;
    
    if (fs.existsSync(iconPath)) {
      icon = iconPath;
    } else {
      // Create a blank transparent image
      icon = nativeImage.createEmpty();
      const size = { width: 16, height: 16 };
      icon = icon.resize(size);
      log.warn('Using blank icon - icon.png not found');
    }
    
    tray = new Tray(icon);
    
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open ThreatEye',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
          }
        }
      },
      {
        label: 'Start Monitoring',
        click: () => {
          if (mainWindow) {
            mainWindow.webContents.send('start-monitoring');
          }
        }
      },
      {
        label: 'Stop Monitoring',
        click: () => {
          if (mainWindow) {
            mainWindow.webContents.send('stop-monitoring');
          }
        }
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          isQuitting = true;
          app.quit();
        }
      }
    ]);
    
    tray.setToolTip('ThreatEye Desktop');
    tray.setContextMenu(contextMenu);
    
    tray.on('click', () => {
      if (mainWindow) {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
      }
    });
  } catch (error) {
    log.error('Error creating tray:', error);
    // Continue without a tray
    tray = null;
  }
}

// Start monitoring
async function startMonitoring() {
  if (isMonitoring) return;
  
  isMonitoring = true;
  if (mainWindow) {
    mainWindow.webContents.send('monitoring-status', isMonitoring);
  }
  log.info('Monitoring started');
  
  // Start screenshot capture interval
  const captureInterval = store.get('captureInterval') || 30;
  monitoringInterval = setInterval(captureAndAnalyzeScreen, captureInterval * 1000);
  
  // Capture initial screenshot
  captureAndAnalyzeScreen();
}

// Stop monitoring
function stopMonitoring() {
  if (!isMonitoring) return;
  
  isMonitoring = false;
  if (mainWindow) {
    mainWindow.webContents.send('monitoring-status', isMonitoring);
  }
  log.info('Monitoring stopped');
  
  // Clear interval
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
  }
}

// Capture and analyze screenshot
async function captureAndAnalyzeScreen() {
  if (!isMonitoring) return;
  
  try {
    // Take screenshot
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const screenshotPath = path.join(tempDir, `screenshot-${timestamp}.png`);
    
    await screenshot({ filename: screenshotPath });
    log.info(`Screenshot captured: ${screenshotPath}`);
    
    // In a real app, you would analyze the screenshot here
    // For now, just notify the renderer
    if (mainWindow) {
      mainWindow.webContents.send('screenshot-captured', {
        path: screenshotPath,
        timestamp: new Date().toISOString()
      });
    }
    
    // Simulate analysis
    simulateAnalysis(screenshotPath);
    
    // Delete screenshot after analysis
    fs.unlinkSync(screenshotPath);
    
  } catch (error) {
    log.error('Error capturing or analyzing screenshot:', error);
    if (mainWindow) {
      mainWindow.webContents.send('screenshot-error', {
        error: error.message
      });
    }
  }
}

// Simulate analysis with random detections
function simulateAnalysis(screenshotPath) {
  setTimeout(() => {
    const hasDetection = Math.random() < 0.2; // 20% chance of detection
    
    if (hasDetection && mainWindow) {
      const severity = Math.random() < 0.3 ? 'high' : (Math.random() < 0.7 ? 'medium' : 'low');
      const contentTypes = ['Hate speech', 'Violent content', 'Extremist propaganda', 'Radicalization material'];
      const detectionType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
      
      const detection = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        type: detectionType,
        severity: severity,
        description: `Detected ${detectionType.toLowerCase()} in screen capture`,
        confidence: (0.7 + Math.random() * 0.3).toFixed(2)
      };
      
      log.info(`Detection: ${detection.type} (${detection.severity})`);
      mainWindow.webContents.send('detection', detection);
    }
  }, 1000 + Math.random() * 2000); // Simulate processing time (1-3 seconds)
}

// IPC listeners for renderer process communication
ipcMain.on('save-settings', (event, settings) => {
  store.set(settings);
  event.reply('settings-saved', true);
});

ipcMain.on('get-settings', (event) => {
  event.reply('settings-loaded', store.store);
});

ipcMain.on('start-monitoring', async (event) => {
  await startMonitoring();
  event.reply('monitoring-status', isMonitoring);
});

ipcMain.on('stop-monitoring', (event) => {
  stopMonitoring();
  event.reply('monitoring-status', isMonitoring);
});

ipcMain.on('get-system-info', (event) => {
  const info = {
    platform: os.platform(),
    release: os.release(),
    arch: os.arch(),
    hostname: os.hostname(),
    userInfo: os.userInfo().username,
    uptime: os.uptime()
  };
  
  event.reply('system-info', info);
});

// Create window when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Set the app to quit completely when quitting is requested
app.on('before-quit', () => {
  isQuitting = true;
  // Stop monitoring before quitting
  stopMonitoring();
}); 