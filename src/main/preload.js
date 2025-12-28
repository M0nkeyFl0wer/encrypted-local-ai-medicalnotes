const { contextBridge, ipcRenderer } = require('electron');

// Expose secure API to renderer process
contextBridge.exposeInMainWorld('medicalAPI', {
    init: () => ipcRenderer.invoke('medical:init'),
    generateKey: () => ipcRenderer.invoke('medical:generateKey'),
    encrypt: (noteContent, patientId, keyHex) =>
        ipcRenderer.invoke('medical:encrypt', { noteContent, patientId, keyHex }),
    decrypt: (encryptedNote, keyHex) =>
        ipcRenderer.invoke('medical:decrypt', { encryptedNote, keyHex }),
    getAuditLog: () => ipcRenderer.invoke('medical:audit'),
    saveDialog: (options) => ipcRenderer.invoke('dialog:save', options)
});
