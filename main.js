const { app, BrowserWindow, ipcMain } = require('electron');
const sudo = require('sudo-prompt');  // Import sudo-prompt
require('dotenv').config();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');
}

// Function to change the system time using sudo-prompt
function changeSystemTime(newTime) {
  const command = `date --set="${newTime}"`;

  // Using sudo-prompt to execute the command with elevated privileges
  sudo.exec(command, { name: 'Electron Time Changer' }, (error, stdout, stderr) => {
    if (error) {
      mainWindow.webContents.send('time-change-status', { success: false, error: error.message });
      return;
    }
    if (stderr) {
      mainWindow.webContents.send('time-change-status', { success: false, error: stderr });
      return;
    }
    mainWindow.webContents.send('time-change-status', { success: true, output: stdout });
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC communication to handle time change requests
ipcMain.on('change-time', (event, newTime) => {
  changeSystemTime(newTime);
});
