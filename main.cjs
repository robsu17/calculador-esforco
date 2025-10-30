const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const os = require('os');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets', 'agil.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: true,
  });

  const candidates = app.isPackaged
    ? [
        path.join(process.resourcesPath, 'app', 'renderer', 'index.html'),
        path.join(process.resourcesPath, 'renderer', 'index.html'),
        path.join(process.resourcesPath, 'app.asar', 'renderer', 'index.html'),
      ]
    : [path.join(__dirname, 'renderer', 'index.html')];

  const found = candidates.find((p) => fs.existsSync(p));
  const logLines = [
    `timestamp=${new Date().toISOString()}`,
    `isPackaged=${app.isPackaged}`,
    `candidates=${JSON.stringify(candidates)}`,
    `found=${found || 'none'}`,
  ];
  try {
    const logPath = path.join(app.getPath('userData'), 'electron-debug.log');
    fs.appendFileSync(logPath, logLines.join(os.EOL) + os.EOL);
    console.log('Wrote debug log to', logPath);
  } catch (e) {
    console.error('Failed to write debug log', e);
  }

  const startUrl = url.format({
    pathname: (found || candidates[0]),
    protocol: 'file:',
    slashes: true,
  });

  win.loadURL(startUrl).catch((err) => console.error('loadURL error', err));

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('did-fail-load', { errorCode, errorDescription, validatedURL });
  });

  win.webContents.on('console-message', (e, level, message, line, sourceId) => {
    console.log('Renderer console:', { level, message, line, sourceId });
  });

  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
