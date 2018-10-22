import { ipcMain, globalShortcut } from 'electron'
import db from '../db'
import window from '../window'
import storage from '../storage'
class message {
  constructor () {
    this.regist('storage-config')
    this.regist('storage-save')
    this.regist('storage-remove')

    this.regist('app-config')
    this.regist('update-config')
    this.regist('pics-upload')

    this.regist('pics-fetch')
    this.regist('shortcut-regist')
  }
  init () {
    this.initStorage()
  }
  initStorage = async () => {
    let ret = await db.getStorage()
    let config = await db.fetchConfig()
    // console.log('storageConfig', ret)
    storage.init(ret, config)
  }
  regist (sendMsg) {
    let method = sendMsg.replace(/-(\w)/g, function (all, letter) {
      return letter.toUpperCase()
    })
    ipcMain.on(sendMsg, this[method])
  }
  replyMsg = (arg, params = {}) => {
    arg.from = arg.from === undefined ? 'home' : arg.from
    let ipc = window.getWebContentsByName(arg.from)
    ipc.send(arg.replyMsg, params)
  }
  storageConfig = async (event, arg) => {
    let ret = await db.getStorage()
    this.replyMsg(arg, ret)
  }
  storageSave = async (event, arg) => {
    delete arg.storage.createdAt
    delete arg.storage.updatedAt
    let ret = null
    if (arg.storage.id) {
      ret = await db.updateStorage(arg.storage)
    } else {
      ret = await db.addStorage(arg.storage)
      ret.dataValues.isNew = true
    }

    this.initStorage()

    console.log('storageSave', ret)
    this.replyMsg(arg, ret.dataValues)
    arg.from = 'home'
    arg.replyMsg = 'app-config-reply'
    this.appConfig(null, arg)
  }
  storageRemove = async (event, arg) => {
    let ret = await db.removeStorage(arg.id)
    console.log('storageRemove', ret)
    this.replyMsg(arg, ret.dataValues)
  }

  picsUpload = async (event, arg) => {
    let ret = await storage.upload(arg)
    this.replyMsg(arg, ret)
  }

  picsFetch = async (event, arg) => {
    let size = arg.size !== undefined ? arg.size : 20
    let ret = await db.fetchPicsByPage(arg.page, size)
    this.replyMsg(arg, ret)
  }
  appConfig = async (event, arg) => {
    let config = await db.fetchConfig()
    let storages = await db.getStorage()
    this.replyMsg(arg, { config: config, storages: storages })
  }

  updateConfig = async (event, arg) => {
    await db.updateConfig(arg.config)
    this.initStorage()
    this.replyMsg(arg)
  }

  shortcutRegist = async (event, arg) => {
    globalShortcut.unregisterAll()
    globalShortcut.register(arg.shortcut, () => {
      console.log('CommandOrControl+Ctrl+C is pressed')
      this.picsUpload(null, { replyMsg: 'pics-upload-reply' })
    })
  }

  errorMsg = (msg, from = null) => {
    from = from == null ? 'home' : from
    let ipc = window.getWebContentsByName(from)
    ipc.send('ppic-error', msg)
  }
}
export default new message()
