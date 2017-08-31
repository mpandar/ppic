import { app, ipcMain, BrowserWindow, globalShortcut } from 'electron'
import window from './window'
import db from './db'
import msg from './message'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  // mainWindow = new BrowserWindow({
  //   height: 563,
  //   useContentSize: true,
  //   width: 1000
  // })

  // mainWindow.loadURL(winURL)

  // mainWindow.on('closed', () => {
  //   mainWindow = null
  // })
  db.init()
  msg.init()
  let item = {
    storeName: '七牛', accessKey: 'y9Ehh4K2i6o4IjCu8kvo0dT319kk2MS3Xbx6O9nJ', secretKey: 'V-fzA71AJ1oRnLHcJN4YAYl7yoOaz2kFW0MuakJj',
    bucket: 'resources', origin: 'up-z1.qiniu.com', url: 'img.j2do.com'
  }
  // db.addQiniu(item)
  // db.addPic1(item)
  globalShortcut.register('CommandOrControl+Ctrl+C', () => {
    console.log('CommandOrControl+Ctrl+C is pressed')
    msg.picsUpload(null, { replyMsg: 'pics-upload-reply' })
  })
  window.home().open()
}

ipcMain.on('openSetting', () => {
  window.setting().open()
})
app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
