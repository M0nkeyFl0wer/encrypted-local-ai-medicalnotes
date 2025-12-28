const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { EncryptedMedicalNotesSystem } = require('../index.js');

let mainWindow;
let medicalSystem;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        titleBarStyle: 'hiddenInset',
        backgroundColor: '#1a1a2e'
    });

    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

async function initializeMedicalSystem() {
    medicalSystem = new EncryptedMedicalNotesSystem();
    await medicalSystem.initialize();
    return true;
}

// IPC Handlers for secure communication with renderer
ipcMain.handle('medical:init', async () => {
    return await initializeMedicalSystem();
});

ipcMain.handle('medical:generateKey', async () => {
    const key = medicalSystem.generateKey();
    return key.toString('hex');
});

ipcMain.handle('medical:encrypt', async (event, { noteContent, patientId, keyHex }) => {
    const key = Buffer.from(keyHex, 'hex');
    const encrypted = await medicalSystem.encryptMedicalNote(noteContent, patientId, key);
    await medicalSystem.saveMedicalNote(encrypted);
    return encrypted;
});

ipcMain.handle('medical:decrypt', async (event, { encryptedNote, keyHex }) => {
    const key = Buffer.from(keyHex, 'hex');
    return await medicalSystem.decryptMedicalNote(encryptedNote, key);
});

ipcMain.handle('medical:audit', async () => {
    return medicalSystem.auditLog;
});

ipcMain.handle('dialog:save', async (event, { defaultPath, filters }) => {
    const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath,
        filters: filters || [{ name: 'Encrypted Notes', extensions: ['json'] }]
    });
    return result;
});

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

// Security: Disable navigation to external URLs
app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
        event.preventDefault();
    });
});
