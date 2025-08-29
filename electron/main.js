const { app, BrowserWindow, screen } = require('electron');

let mainWindow;

app.whenReady().then(() => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const windowWidth = 1079;
  const windowHeight = 1906;

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    frame: true,
    resizable: true,
    fullscreenable: true,
    fullscreen: true,
    // useContentSize: false, // ❗️Asegura que el tamaño incluya bordes
    webPreferences: {
      nodeIntegration: true
    },
    experimentalFeatures: true, // 🔥 Para activar soporte experimental táctil si hace falta
    scrollBounce: true,
  });

  mainWindow.webContents.session.clearCache();

  mainWindow.webContents.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  );

  mainWindow.webContents.setZoomFactor(1);

  mainWindow.once('ready-to-show', () => {
    // Fuerza el tamaño deseado, incluso si excede el área visible
    mainWindow.setBounds({
      x: 0,
      y: 0,
      width: windowWidth,
      height: windowHeight
    }, true); // ← importante: el segundo argumento es `animate`, opcional
    console.log('Forzando tamaño a:', mainWindow.getBounds());
  });

  console.log('Screen Size:', width, height);
  console.log('Window Size:', mainWindow.getBounds());

  mainWindow.loadURL('http://localhost:5173');
});
