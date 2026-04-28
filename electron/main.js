const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { contextIsolation: true }
  });

  if (app.isPackaged) {
    // app.getAppPath() works whether app is inside an asar or unpacked
    const appPath = app.getAppPath();
    const indexPath = path.join(appPath, 'out', 'index.html');

    win.loadFile(indexPath).catch(err => {
      console.error('Failed to load index.html from', indexPath, err);
      // try alternate location (unpacked resources)
      const alt = path.join(process.resourcesPath, 'app', 'out', 'index.html');
      win.loadFile(alt).catch(err2 => {
        console.error('Failed to load index.html from alt path', alt, err2);
        // as a last resort, show an error page or blank
        win.loadURL('about:blank');
      });
    });
  } else {
    win.loadURL('http://localhost:3000');
  }

  win.webContents.on('did-fail-load', (e, errorCode, errorDescription, validatedURL) => {
    console.error('did-fail-load', { errorCode, errorDescription, validatedURL });
  });
  win.webContents.on('crashed', () => console.error('renderer crashed'));
  win.webContents.on('console-message', (e, level, message, line, sourceId) => {
    console.log(`[renderer:${level}] ${message} (${sourceId}:${line})`);
  });

  if (!app.isPackaged || process.env.ELECTRON_DEBUG === '1') {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
process.on('uncaughtException', (err) => console.error('main uncaught', err));
