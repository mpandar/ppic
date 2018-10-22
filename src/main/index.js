import { app, ipcMain } from 'electron'
import window from './window'
import db from './db'
import msg from './message'
import menu from './window/menu.js'
import autoupdate from './update'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
// const winURL = process.env.NODE_ENV === 'development'
//   ? `http://localhost:9080`
//   : `file://${__dirname}/index.html`

setTimeout(autoupdate, 5000)

async function createWindow () {
  await db.init()
  msg.init()
  // let item = {
  //   storeName: '七牛', accessKey: 'y9Ehh4K2i6o4IjCu8kvo0dT319kk2MS3Xbx6O9nJ', secretKey: 'V-fzA71AJ1oRnLHcJN4YAYl7yoOaz2kFW0MuakJj',
  //   bucket: ' ', origin: 'up-z1.qiniu.com', url: 'img.j2do.com'
  // }

  menu()
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
