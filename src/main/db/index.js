import sqlite3 from 'sqlite3'
import fs from 'fs'
import fecha from 'fecha'
import Sequelize from 'sequelize'
class db {
  constructor() {
    this.sequelize = null
    this.storage = null
    this.image = null
  }
  init = () => {
    try {
      fs.mkdirSync('./data')
    } catch (e) {
      if (e.code !== 'EEXIST') {
        return
      }
      console.log(e)
    }
    this.sequelize = new Sequelize(null, null, null, {
      dialect: 'sqlite',
      // SQLite only
      storage: 'data/ppic.db'
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
          defaultValue: "未命名",
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
      console.error('Unable to connect to the database:', err);
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
        origin: Sequelize.STRING,
        url: Sequelize.STRING,
        storeType: {
          type: Sequelize.STRING,
          allowNull: false
        }
      }
    )
    this.storage.sync().catch(err => {
      console.error('Unable to connect to the database:', err);
    })

  }

  getStorage = async () => {
    return await this.storage.findAll({ raw: true })
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
    return await this.image.build(pic, { raw: true }).save()
  }

  async fetchPicsByPage(page, size) {
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
}
export default new db