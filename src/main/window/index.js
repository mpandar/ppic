'use strict'
import windowManager from 'electron-window-manager'
// import menu from './menu'
const homeURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/index.html`
  : `file://${__dirname}/index.html`

const settingURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/setting.html`
  : `file://${__dirname}/setting.html`

class Window {
  home() {
    var win = windowManager.get('home')
    if (win !== false) {
      return win
    }
    console.log('home', win)
    var homeWindow = windowManager.createNew('home', 'Welcome ...', homeURL, false, {
      'width': 900,
      'height': 600,
      'showDevTools': true,
      'resizable': true
    })
    // homeWindow.create()
    // menu.init()
    return homeWindow
  }
  setting() {
    var win = windowManager.get('setting')
    if (win !== false) {
      return win
    }
    console.log('setting', win)
    var settingWindow = windowManager.createNew('setting', 'Welcome ...', settingURL, false, {
      'width': 600,
      'height': 450,
      'showDevTools': true,
      'resizable': true
    })
    // settingWindow.create()
    return settingWindow
  }
  getWebContentsByName(name) {
    var win = windowManager.get(name)
    if (win !== false) {
      return win.object.webContents
    }
    return false
  }
}

export default new Window()
