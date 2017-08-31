import { ipcMain } from 'electron'
import db from '../db'
import window from '../window'
import storage from '../storage'
class message {
  constructor() {
    this.regist('storage-config')
    this.regist('storage-save')
    this.regist('storage-remove')

    this.regist('app-config')
    this.regist('pics-upload')

    this.regist('pics-fetch')
  }
  init() {
    this.initStorage()
  }
  initStorage = async () => {
    let ret = await db.getStorage()
    // console.log('storageConfig', ret)
    storage.init(ret, { type: 'point', id: 1 })
  }
  regist(sendMsg) {
    let method = sendMsg.replace(/-(\w)/g, function (all, letter) {
      return letter.toUpperCase()
    })
    ipcMain.on(sendMsg, this[method])
  }
  replyMsg = (arg, params) => {
    arg.from = arg.from == undefined ? 'home' : arg.from
    let ipc = window.getWebContentsByName(arg.from)
    ipc.send(arg.replyMsg, params)
  }
  storageConfig = async (event, arg) => {
    let ret = await db.getStorage()
    console.log('storageConfig', ret)
    this.replyMsg(arg, ret)
  }
  storageSave = async (event, arg) => {
    delete arg.storage.createdAt;
    delete arg.storage.updatedAt;
    let ret = null;
    if (arg.storage.id) {
      ret = await db.updateStorage(arg.storage)
    } else {
      ret = await db.addStorage(arg.storage)
      ret.dataValues.isNew = true
    }

    console.log('storageSave', ret)
    this.replyMsg(arg, ret.dataValues)
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
    let size = arg.size != undefined ? arg.size : 20
    let ret = await db.fetchPicsByPage(arg.page, size)
    this.replyMsg(arg, ret)
  }
  appConfig = () => {

  }
}
export default new message
