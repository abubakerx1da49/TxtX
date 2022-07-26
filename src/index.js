const { app, BrowserWindow, ipcMain, globalShortcut, dialog } = require('electron');
const path = require('path');
let fs = require('fs')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

let mainWindow

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    minWidth: 400,
    minHeight: 300,
    // icon: 'logo.png',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    frame: false,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

ipcMain.on('click-open-button', (event, arg) => {

  if (arg == 'true') {
    
    dialog.showOpenDialog(mainWindow, {
      title: 'Markdown Editor - Choose an Markdown File',
      filters: [
        { name: 'Text Files', extensions: ['txt'] }
      ],
      properties: ['openFile']
    }).then(result => {
      let filePath = result.filePaths[0]

      app.addRecentDocument(filePath)

      readFile(filePath)
    }).catch(err => {
      console.log(err)
    })

    let readFile = (filepath) => {
      fs.readFile(filepath, 'utf-8', (err, data) => {
        let allData = {
          filepath: filepath,
          filedata: data
        }
        event.sender.send('fileData_Open', allData)
      })
    }


  }

})

ipcMain.on('quit-app', (event) => {
  app.quit()
})

ipcMain.on('minimize-app', (event) => {
  BrowserWindow.getFocusedWindow().minimize()
})

ipcMain.on('reload-app', (event) => {
  BrowserWindow.getFocusedWindow().reload()
})

ipcMain.on('maximize-app', (event) => {
  let icon = ""
  if (BrowserWindow.getFocusedWindow().isMaximized()) {
    BrowserWindow.getFocusedWindow().unmaximize()
    icon = "Max"
  } else {
    BrowserWindow.getFocusedWindow().maximize()
    icon = "UnMax"
  }

})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
