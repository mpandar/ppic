import Qiniu from './qiniu'
import { nativeImage, clipboard } from 'electron'
import fecha from 'fecha'
import md5 from 'md5'
import db from '../db'
class storage {
  constructor() {
    this.type = null
    this.id = null
    this.storages = []
  }

  init(storages, config) {
    this.type = config.type
    this.id = config.id
    this.storages = []
    if (this.type == 'point') {
      for (let s of storages) {
        if (s.id == this.id) {
          let connect = this.connect(s)
          this.storages.push(connect)
        }
      }
    }
    console.log('init storages', this.storages)
  }
  * getStorageInstance() {
    while (1) {
      for (let instance of this.storages) {
        yield instance
      }
    }
  }
  connect(storage) {
    switch (storage.storeType) {
      case 'qiniu':
        let qiniu = new Qiniu(storage.accessKey, storage.secretKey, storage.bucket, storage.origin, storage.url)
        qiniu.connect()
        return qiniu
    }
    throw new Error('Unknow Storage Type!')
  }
  async upload(arg) {
    let instance = this.getStorageInstance().next().value
    arg.img = arg.img ? nativeImage.createFromPath(arg.img) : clipboard.readImage()
    let picInfo = this.getUploadInfo(arg)
    console.log('upload info', picInfo)
    //uplaod to qiniu
    let ret = await instance.upload(arg.img, picInfo.filename)
    if (ret.error !== undefined) {
      throw new Error(ret.error)
    }
    picInfo.storeType = instance.storeType
    picInfo.url = instance.url + '/' + picInfo.filename
    // console.log('db', db)
    ret = await db.addPic(picInfo)
    return ret.dataValues
  }


  getUploadInfo(arg) {
    let buffer = arg.img.toJPEG(50)
    let { width, height } = arg.img.getSize()
    // console.log(a.getSize())
    if (width === 0 || height === 0) {
      throw new Error("Not valid image!")
    }
    let date = new Date()
    let size = '.' + width.toString() + '*' + height.toString() + '.'
    let filename = 'ppic/' + fecha.format(date, 'YYYYMMDDHHmmss') + size + md5(buffer).substr(0, 5) + '.jpg'
    return { filename: filename, width: width, height: height }
  }
  close() {

  }
  delete() {

  }
}
export default new storage