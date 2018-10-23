// import sqlite3 from 'sqlite3'
import fs from 'fs'
// import fecha from 'fecha'
import Sequelize from 'sequelize'
import { app } from 'electron'
class Db {
  constructor () {
    this.sequelize = null
    this.storage = null
    this.image = null
  }
  init = async () => {
    let dataDir = app.getPath('appData') + '/' + app.getName() + '/data'
    try {
      fs.mkdirSync(dataDir)
    } catch (e) {
      if (e.code !== 'EEXIST') {
        return
      }
      console.log(e)
    }
    this.sequelize = new Sequelize(null, null, null, {
      dialect: 'sqlite',
      // SQLite only
      storage: dataDir + '/ppic.db'
    })
    this.image = this.sequelize.define(
      'image',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        remark: {
          type: Sequelize.STRING,
          defaultValue: '未命名'
        },
        filename: {
          type: Sequelize.STRING
        },
        url: {
          type: Sequelize.STRING,
          allowNull: true
        },
        width: Sequelize.INTEGER,
        height: Sequelize.INTEGER,
        storeType: {
          type: Sequelize.STRING,
          allowNull: false
        }
      }
    )
    this.image.sync().catch(err => {
      console.error('Unable to connect to the database:', err)
    })

    this.storage = this.sequelize.define(
      'storage',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        storeName: Sequelize.STRING,
        accessKey: Sequelize.STRING,
        secretKey: Sequelize.STRING,
        bucket: Sequelize.STRING,
        origin: Sequelize.STRING, // 其实存储的是uploadurl，懒得改名字了...
        url: Sequelize.STRING,
        storeType: {
          type: Sequelize.STRING,
          allowNull: false
        }
      }
    )
    this.storage.sync().catch(err => {
      console.error('Unable to connect to the database:', err)
    })

    this.config = this.sequelize.define(
      'config',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        config: Sequelize.STRING(1024)
      }
    )
    this.config.sync().catch(err => {
      console.error('Unable to connect to the database:', err)
    })
    let config = { autostart: false, autozip: { on: false, level: 5 }, shortcut: 'ctrl+meta+c', storages: [1] }
    let ret = await this.config.findById(1)
    if (ret === null) {
      await this.config.create({ id: 1, config: JSON.stringify(config) })
    }
    // try {
    //   this.config.findOrCreate({
    //     where: {
    //       id: 1
    //     },
    //     defaults: {
    //       config:
    //     }
    //   })
    // } catch (error) {
    //   console.log('db init config', error)
    // }
  }

  getStorage = async () => {
    let ret = await this.storage.findAll({ raw: true })
    return ret
  }

  addStorage = async (item) => {
    let ret = await this.storage.build(item).save()
    return ret
  }
  updateStorage = async (item) => {
    console.log('updateStorage', item)
    let ret = null
    try {
      let task = await this.storage.findById(item.id)
      ret = await task.update(item)
    } catch (error) {
      throw new Error('Storage Save Error')
    }
    return ret
  }
  removeStorage = async (id) => {
    let ret = null
    try {
      let task = await this.storage.findById(id)
      ret = await task.destroy({ force: true })
    } catch (error) {
      throw new Error('Storage Remove Error')
    }
    return ret
  }
  addQiniu = async (item) => {
    item.storeType = 'qiniu'
    let ret = await this.addStorage(item)
    console.log('addQiniu', ret)
    return ret
  }

  addPic = async (pic) => {
    console.log('addPic', pic)
    let ret = await this.image.build(pic, { raw: true }).save()
    return ret
  }

  async fetchPicsByPage (page, size) {
    let offset = (page - 1) * size
    let ret
    try {
      ret = await this.image.findAndCountAll({
        offset: offset,
        limit: size,
        order: [['id', 'desc']],
        raw: true
      })
    } catch (error) {
      console.log(error)
      throw new Error('Image Fetch Error')
    }
    return ret
  }

  async updateConfig (config) {
    let task = await this.config.findById(1)
    task.config = JSON.stringify(config)
    let ret = await task.save({ fields: ['config'] })
    console.log('updateConfig', ret)
    return ret
  }

  async fetchConfig () {
    try {
      let ret = await this.config.findById(1)
      let config = JSON.parse(ret.config)
      // console.log('fetchConfig2', config)
      return config
    } catch (error) {
      console.log('fetchConfig', error)
    }
  }
}
export default new Db()
