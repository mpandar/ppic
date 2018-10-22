import http from 'http'
import { app, ipcMain } from 'electron'
import message from '../message'
import url from 'url'
import md5File from 'md5-file'
import PPicError from '../error'
const fs = require('fs')
const download = require('download')

function compareVersion (left, right) {
  try {
    let vleft = left.split('.')
    let vright = right.split('.')
    console.log('compareVersion', vleft, vright)
    if (Number(vleft[0]) > Number(vright[0]) || Number(vleft[1]) > Number(vright[1]) || Number(vleft[2]) > Number(vright[2])) {
      return true
    }
    return false
  } catch (error) {
    console.log('compareVersion error', error)
  }
}

function checkVersion () {
  let t = Date.now()
  // console.log('done!!', 'http://img.j2do.com/update.json?' + t);
  // download('http://img.j2do.com/update.json?' + t + '&attname=#(Content-Disposition: inline)', 'dist').then(data => {
  //   console.log('done!', data);
  //   // try {
  //   //   let update = JSON.parse(data)
  //   //   let current = JSON.parse(fs.readFileSync('package.json'))
  //   //   console.log('checkVersion', update.version, current.version)
  //   //   if (compareVersion(update.version, current.version)) {
  //   //     let arg = { replyMsg: 'new-version' }
  //   //     message.replyMsg(arg, update)
  //   //   }

  //   // } catch (error) {
  //   //   console.log('checkVersion error', error)
  //   // }

  // }).catch((error) => {
  //   console.log('error', error)
  // });;
  var options = {
    hostname: 'http://img.j2do.com/update.json?' + t,
    port: 80
  }
  console.log('options', options)
  var req = http.request('http://img.j2do.com/update.json?' + t, (res) => {
    res.setEncoding('utf-8')
    res.on('data', (data) => {
      try {
        let update = JSON.parse(data)
        // let current = JSON.parse(fs.readFileSync('package.json'))
        let currentVersion = app.getVersion()
        console.log('checkVersion', update.version, currentVersion)
        if (compareVersion(update.version, currentVersion)) {
          let arg = { replyMsg: 'new-version' }
          message.replyMsg(arg, update)
        }
      } catch (error) {
        console.log('checkVersion error', error)
        throw new PPicError(PPicError.GetUpdatePackage, error)
      }
    })
  })
  req.on('error', function (err) {
    console.log('error', err.message)
    throw new PPicError(PPicError.GetUpdatePackage, err.message)
  })
  req.end()
}

ipcMain.on('download', async (event, arg) => {
  console.log('done!', arg.file.url)
  let file = process.env.HOME + '/Downloads' + url.parse(arg.file.url).pathname
  console.log('download', fs.existsSync(file), md5File.sync(file), arg.file.md5, md5File.sync(file) == arg.file.md5)

  if (fs.existsSync(file) && md5File.sync(file) == arg.file.md5) {

  } else {
    let d = await download(arg.file.url, process.env.HOME + '/Downloads')
  }

  let params = {
    file: file
  }
  let ret = { replyMsg: arg.replyMsg }

  message.replyMsg(ret, params)
})

let autoupdate = function () {
  console.log('autoupdate check', process.env.HOME)
  checkVersion()
}

export default autoupdate
