const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    ipcRenderer: {
      send: (channel, data) => {
        // whitelist channels
        const validChannels = [
          'get-settings', 
          'save-settings', 
          'start-monitoring', 
          'stop-monitoring', 
          'get-system-info'
        ];
        if (validChannels.includes(channel)) {
          ipcRenderer.send(channel, data);
        }
      },
      on: (channel, func) => {
        const validChannels = [
          'settings-loaded',
          'settings-saved',
          'monitoring-status',
          'screenshot-captured',
          'screenshot-error',
          'detection',
          'system-info',
          'start-monitoring',
          'stop-monitoring'
        ];
        if (validChannels.includes(channel)) {
          // Deliberately strip event as it includes `sender` 
          ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
        }
      },
      once: (channel, func) => {
        const validChannels = [
          'settings-loaded',
          'settings-saved',
          'system-info'
        ];
        if (validChannels.includes(channel)) {
          // Deliberately strip event as it includes `sender` 
          ipcRenderer.once(channel, (event, ...args) => func(event, ...args));
        }
      },
      removeListener: (channel, func) => {
        ipcRenderer.removeListener(channel, func);
      }
    }
  }
); 