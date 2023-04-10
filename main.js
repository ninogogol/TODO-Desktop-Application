const { app, BrowserWindow } = require('electron')
const { enable } = require('@electron/remote/main')
const path = require('path')

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, './renderer/icon/favicon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })

    win.webContents.on('did-finish-load', () => {
        win.webContents.send('userDataPath', app.getPath('userData'))
    })    

    win.loadFile('./renderer/index.html')

    win.setMenu(null)

    // Enable remote module for this BrowserWindow
    enable(win.webContents)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
