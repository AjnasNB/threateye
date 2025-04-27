// ThreatEye Desktop App JS

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the app
  initApp();
  
  // Listen for IPC messages from main process
  setupIPCListeners();
});

// Global variables
let isMonitoring = false;
let captureInterval = null;
let settings = {
  apiKey: '',
  serverUrl: 'http://localhost:3000',
  captureInterval: 30,
  startOnLaunch: false,
  enableNotifications: true
};

// Set up IPC listeners for main process messages
function setupIPCListeners() {
  // Check if electron is available (we're in a desktop environment)
  if (typeof window.electron !== 'undefined') {
    // Listen for monitoring status updates
    window.electron.ipcRenderer.on('monitoring-status', (event, status) => {
      isMonitoring = status;
      updateMonitoringButtonStates();
      
      const statusIndicator = document.querySelector('.status-indicator');
      const statusText = document.querySelector('.status-text');
      
      if (status) {
        statusIndicator.classList.add('active');
        statusText.textContent = 'Monitoring Active';
      } else {
        statusIndicator.classList.remove('active');
        statusText.textContent = 'Monitoring Inactive';
      }
    });
    
    // Listen for screenshot capture events
    window.electron.ipcRenderer.on('screenshot-captured', (event, data) => {
      addLogEntry(`Screenshot captured at ${new Date(data.timestamp).toLocaleTimeString()}`);
    });
    
    // Listen for screenshot errors
    window.electron.ipcRenderer.on('screenshot-error', (event, data) => {
      addLogEntry(`Screenshot error: ${data.error}`, 'error');
    });
    
    // Listen for detection events
    window.electron.ipcRenderer.on('detection', (event, detection) => {
      addLogEntry(`Detection: ${detection.type} (${detection.severity})`, 'warning');
      
      // Update last detection time
      document.getElementById('last-detection').textContent = new Date(detection.timestamp).toLocaleTimeString();
      
      // Increment detection count
      const detectionsElement = document.getElementById('detections-count');
      let detectionsCount = parseInt(detectionsElement.textContent, 10) || 0;
      detectionsCount++;
      detectionsElement.textContent = detectionsCount;
      
      // Show notification
      if (settings.enableNotifications) {
        showNotification(`Detection: ${detection.type} (${detection.severity})`, 'warning');
      }
      
      // Update mini log
      updateMiniLog();
    });
    
    // Listen for start-monitoring command
    window.electron.ipcRenderer.on('start-monitoring', () => {
      startMonitoring();
    });
    
    // Listen for stop-monitoring command
    window.electron.ipcRenderer.on('stop-monitoring', () => {
      stopMonitoring();
    });
  }
}

// Initialize the application
function initApp() {
  // Load settings from localStorage
  loadSettings();
  
  // Setup tab navigation
  setupTabs();
  
  // Setup UI controls
  setupUIControls();
  
  // Update stats display
  updateStats();
  
  // Start monitoring if set in settings
  if (settings.startOnLaunch) {
    startMonitoring();
  }
  
  // Add a log entry for app start
  addLogEntry('Application started');
  
  // Load mock detection data
  loadMockDetections();
  
  // Initialize mini-log in dashboard
  updateMiniLog();
}

// Load settings from localStorage or main process
function loadSettings() {
  if (typeof window.electron !== 'undefined') {
    // In a desktop environment, request settings from the main process
    window.electron.ipcRenderer.send('get-settings');
    
    // Set up a listener for the response
    window.electron.ipcRenderer.once('settings-loaded', (event, storedSettings) => {
      if (storedSettings) {
        settings = { ...settings, ...storedSettings };
        
        // Populate settings form
        document.getElementById('api-key').value = settings.apiKey || '';
        document.getElementById('server-url').value = settings.serverUrl || 'http://localhost:3000';
        document.getElementById('capture-interval').value = settings.captureInterval || 30;
        document.getElementById('start-on-launch').checked = settings.startOnLaunch || false;
        document.getElementById('enable-notifications').checked = settings.enableNotifications !== false;
      }
    });
  } else {
    // In a web environment, load from localStorage
    const savedSettings = localStorage.getItem('threatEyeSettings');
    
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        settings = { ...settings, ...parsedSettings };
        
        // Populate settings form
        document.getElementById('api-key').value = settings.apiKey;
        document.getElementById('server-url').value = settings.serverUrl;
        document.getElementById('capture-interval').value = settings.captureInterval;
        document.getElementById('start-on-launch').checked = settings.startOnLaunch;
        document.getElementById('enable-notifications').checked = settings.enableNotifications;
      } catch (error) {
        console.error('Error loading settings:', error);
        addLogEntry('Error loading settings from storage', 'error');
      }
    }
  }
}

// Save settings to localStorage
function saveSettings() {
  try {
    // Get values from the form
    settings.apiKey = document.getElementById('api-key').value;
    settings.serverUrl = document.getElementById('server-url').value;
    settings.captureInterval = parseInt(document.getElementById('capture-interval').value, 10);
    settings.startOnLaunch = document.getElementById('start-on-launch').checked;
    settings.enableNotifications = document.getElementById('enable-notifications').checked;
    
    // In a desktop environment, we send a message to the main process
    if (typeof window.electron !== 'undefined') {
      window.electron.ipcRenderer.send('save-settings', settings);
    } else {
      // In a web environment, save to localStorage
      localStorage.setItem('threatEyeSettings', JSON.stringify(settings));
    }
    
    // Show success notification
    showNotification('Settings saved successfully', 'success');
    addLogEntry('Settings updated');
    
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    showNotification('Error saving settings', 'error');
    addLogEntry('Error saving settings', 'error');
    
    return false;
  }
}

// Setup tab navigation
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and panes
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      // Add active class to clicked button and corresponding pane
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
}

// Setup UI controls
function setupUIControls() {
  // Start monitoring button
  const startBtn = document.getElementById('start-monitoring');
  startBtn.addEventListener('click', startMonitoring);
  
  // Stop monitoring button
  const stopBtn = document.getElementById('stop-monitoring');
  stopBtn.addEventListener('click', stopMonitoring);
  
  // Save settings button
  const saveSettingsBtn = document.getElementById('save-settings');
  saveSettingsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    saveSettings();
  });
  
  // Setup filter listeners for detections
  setupDetectionFilters();
  
  // Initialize button states
  updateMonitoringButtonStates();
}

// Setup detection filters
function setupDetectionFilters() {
  const statusFilter = document.getElementById('status-filter');
  const severityFilter = document.getElementById('severity-filter');
  const searchInput = document.getElementById('detection-search');
  
  if (statusFilter && severityFilter && searchInput) {
    statusFilter.addEventListener('change', filterDetections);
    severityFilter.addEventListener('change', filterDetections);
    searchInput.addEventListener('input', filterDetections);
  }
}

// Filter detections based on selected filters
function filterDetections() {
  const statusFilter = document.getElementById('status-filter').value;
  const severityFilter = document.getElementById('severity-filter').value;
  const searchTerm = document.getElementById('detection-search').value.toLowerCase();
  const detectionItems = document.querySelectorAll('.detection-item');
  
  detectionItems.forEach(item => {
    const status = item.getAttribute('data-status').toLowerCase();
    const severity = item.getAttribute('data-severity').toLowerCase();
    const content = item.querySelector('.detection-info h4').textContent.toLowerCase();
    
    const statusMatch = statusFilter === 'all' || status === statusFilter.toLowerCase();
    const severityMatch = severityFilter === 'all' || severity === severityFilter.toLowerCase();
    const searchMatch = searchTerm === '' || content.includes(searchTerm);
    
    if (statusMatch && severityMatch && searchMatch) {
      item.style.display = 'grid';
    } else {
      item.style.display = 'none';
    }
  });
}

// Start screen capture and monitoring
function startMonitoring() {
  if (isMonitoring) return;
  
  try {
    // In a desktop environment, we send a message to the main process
    if (typeof window.electron !== 'undefined') {
      window.electron.ipcRenderer.send('start-monitoring');
    } else {
      // In a web environment, we handle it here
      isMonitoring = true;
      updateMonitoringButtonStates();
      
      // Update status indicator
      document.querySelector('.status-indicator').classList.add('active');
      document.querySelector('.status-text').textContent = 'Monitoring Active';
      
      // Log the start
      addLogEntry('Started monitoring');
      showNotification('Monitoring started', 'success');
      
      // Schedule regular captures
      captureInterval = setInterval(captureAndAnalyze, settings.captureInterval * 1000);
      
      // Do an immediate capture
      captureAndAnalyze();
      
      // Update CPU and memory stats periodically
      updateStats();
      setInterval(updateStats, 5000);
    }
  } catch (error) {
    console.error('Error starting monitoring:', error);
    addLogEntry(`Error starting monitoring: ${error.message}`, 'error');
    showNotification('Failed to start monitoring', 'error');
    isMonitoring = false;
    updateMonitoringButtonStates();
  }
}

// Stop monitoring
function stopMonitoring() {
  if (!isMonitoring) return;
  
  try {
    // In a desktop environment, we send a message to the main process
    if (typeof window.electron !== 'undefined') {
      window.electron.ipcRenderer.send('stop-monitoring');
    } else {
      // In a web environment, we handle it here
      isMonitoring = false;
      
      // Clear the capture interval
      if (captureInterval) {
        clearInterval(captureInterval);
        captureInterval = null;
      }
      
      // Update status indicator
      document.querySelector('.status-indicator').classList.remove('active');
      document.querySelector('.status-text').textContent = 'Monitoring Inactive';
      
      // Update button states
      updateMonitoringButtonStates();
      
      // Log the stop
      addLogEntry('Stopped monitoring');
      showNotification('Monitoring stopped', 'info');
    }
  } catch (error) {
    console.error('Error stopping monitoring:', error);
    addLogEntry(`Error stopping monitoring: ${error.message}`, 'error');
    showNotification('Error stopping monitoring', 'error');
  }
}

// Update button states based on monitoring status
function updateMonitoringButtonStates() {
  const startBtn = document.getElementById('start-monitoring');
  const stopBtn = document.getElementById('stop-monitoring');
  
  if (isMonitoring) {
    startBtn.disabled = true;
    stopBtn.disabled = false;
  } else {
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
}

// Simulate screen capture and analysis
function captureAndAnalyze() {
  // In a real app, this would capture the screen and send to the analysis API
  
  // Simulate processing time (1-2 seconds)
  const processingTime = 1000 + Math.random() * 1000;
  
  // Log the capture
  addLogEntry('Screen capture initiated');
  
  setTimeout(() => {
    // Simulate analysis result
    const hasDetection = Math.random() < 0.3; // 30% chance of detection
    
    if (hasDetection) {
      const severity = Math.random() < 0.2 ? 'high' : (Math.random() < 0.5 ? 'medium' : 'low');
      const detectionType = ['Hate speech', 'Violent content', 'Extremist propaganda', 'Radicalization material'][Math.floor(Math.random() * 4)];
      
      addLogEntry(`Analysis complete: ${detectionType} detected (${severity})`, 'warning');
      
      // In a real app, this would send the detection to the server
      simulateSendDetectionToServer(detectionType, severity);
      
      if (settings.enableNotifications) {
        showNotification(`Detection: ${detectionType} (${severity} severity)`, 'warning');
      }
      
      // Update last detection time
      document.getElementById('last-detection').textContent = new Date().toLocaleTimeString();
    } else {
      addLogEntry('Analysis complete: No issues detected');
    }
    
    // Update the mini log on dashboard
    updateMiniLog();
  }, processingTime);
}

// Simulate sending detection to server
function simulateSendDetectionToServer(type, severity) {
  console.log(`Sending detection to server: ${type} (${severity})`);
  // In a real app, this would use fetch() to send data to the server
  
  // Simulate server response time (0.5-1.5 seconds)
  setTimeout(() => {
    const success = Math.random() < 0.9; // 90% success rate
    
    if (success) {
      addLogEntry('Detection sent to server successfully');
    } else {
      addLogEntry('Failed to send detection to server', 'error');
      showNotification('Failed to send detection to server', 'error');
    }
    
    // Update the mini log
    updateMiniLog();
  }, 500 + Math.random() * 1000);
}

// Add entry to the log
function addLogEntry(message, type = 'info') {
  const logContainer = document.getElementById('log-container');
  
  if (!logContainer) {
    console.error('Log container not found');
    return;
  }
  
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  
  const timestamp = new Date().toLocaleTimeString();
  entry.textContent = `[${timestamp}] ${message}`;
  
  logContainer.appendChild(entry);
  
  // Scroll to bottom
  logContainer.scrollTop = logContainer.scrollHeight;
  
  // Limit log entries to 100
  const entries = logContainer.querySelectorAll('.log-entry');
  if (entries.length > 100) {
    logContainer.removeChild(entries[0]);
  }
}

// Update mini log on dashboard
function updateMiniLog() {
  const miniLog = document.getElementById('mini-log');
  const logContainer = document.getElementById('log-container');
  
  if (!miniLog || !logContainer) return;
  
  // Copy the last 5 entries to the mini log
  miniLog.innerHTML = '';
  const entries = logContainer.querySelectorAll('.log-entry');
  const recentEntries = Array.from(entries).slice(-5);
  
  recentEntries.forEach(entry => {
    const clone = entry.cloneNode(true);
    miniLog.appendChild(clone);
  });
}

// Show notification
function showNotification(message, type = 'info') {
  const notificationArea = document.querySelector('.notification-area');
  
  if (!notificationArea) {
    console.error('Notification area not found');
    return;
  }
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  notificationArea.appendChild(notification);
  
  // Remove notification after animation completes (5 seconds)
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Update system stats display
function updateStats() {
  // In a real Electron app, we would use process info APIs to get real stats
  
  // Simulate CPU usage (10-60%)
  const cpuUsage = Math.floor(10 + Math.random() * 50);
  document.getElementById('cpu-usage').textContent = `${cpuUsage}%`;
  
  // Simulate memory usage (100-500 MB)
  const memoryUsage = Math.floor(100 + Math.random() * 400);
  document.getElementById('memory-usage').textContent = `${memoryUsage} MB`;
  
  // Update uptime
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  document.getElementById('uptime').textContent = `${hours}:${minutes}:${seconds}`;
  
  // Update detections count (increment occasionally)
  const detectionsElement = document.getElementById('detections-count');
  
  if (detectionsElement) {
    let detectionsCount = parseInt(detectionsElement.textContent, 10) || 0;
    
    if (isMonitoring && Math.random() < 0.1) {
      detectionsCount++;
      detectionsElement.textContent = detectionsCount;
    }
  }
}

// Load mock detection data for the detections tab
function loadMockDetections() {
  const detectionsList = document.getElementById('detections-list');
  
  if (!detectionsList) {
    console.error('Detections list container not found');
    return;
  }
  
  // Clear current list
  detectionsList.innerHTML = '';
  
  // Create sample detections
  const mockDetections = [
    {
      id: 1,
      timestamp: '2023-05-15 09:32:47',
      content: 'Detected violent extremist content in opened tab',
      severity: 'high',
      source: 'Screen capture',
      status: 'new'
    },
    {
      id: 2,
      timestamp: '2023-05-15 08:17:22',
      content: 'Detected potential hate speech in messaging application',
      severity: 'medium',
      source: 'Screen capture',
      status: 'reviewed'
    },
    {
      id: 3,
      timestamp: '2023-05-14 21:53:18',
      content: 'Detected reference to extremist group in social media',
      severity: 'low',
      source: 'Screen capture',
      status: 'false-positive'
    },
    {
      id: 4,
      timestamp: '2023-05-14 16:28:05',
      content: 'Detected propaganda material in document',
      severity: 'high',
      source: 'Screen capture',
      status: 'escalated'
    },
    {
      id: 5,
      timestamp: '2023-05-14 11:05:39',
      content: 'Detected radicalization content in video',
      severity: 'medium',
      source: 'Screen capture',
      status: 'new'
    }
  ];
  
  // Add detections to the list
  mockDetections.forEach(detection => {
    const detectionItem = document.createElement('div');
    detectionItem.className = 'detection-item';
    detectionItem.setAttribute('data-severity', detection.severity);
    detectionItem.setAttribute('data-status', detection.status);
    
    // First letter of severity for the icon
    const severityInitial = detection.severity.charAt(0).toUpperCase();
    
    detectionItem.innerHTML = `
      <div class="detection-icon ${detection.severity}">${severityInitial}</div>
      <div class="detection-info">
        <h4>${detection.content}</h4>
        <div class="detection-meta">
          <span>${detection.timestamp}</span>
          <span>${detection.source}</span>
        </div>
      </div>
      <div class="detection-status ${detection.status}">${detection.status}</div>
    `;
    
    detectionsList.appendChild(detectionItem);
  });
} 