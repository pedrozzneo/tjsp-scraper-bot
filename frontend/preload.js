const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    startScraping: (data) => {
        ipcRenderer.send('start-scraping', data);
    },
    onScrapingStatus: (callback) => {
        ipcRenderer.on('scraping-status', (event, data) => {
            callback(data);
        });
    }
});

