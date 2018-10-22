import message from '../message'

let error = []

class PPicError extends Error {
  constructor (code, msg) {
    let errorMsg = msg || (error[code] === undefined ? '未知错误' : error[code])
    console.log('errorMsg', code, errorMsg)
    let err = { code: code, msg: errorMsg }
    console.log('PPicError', err)
    super(JSON.stringify(err))
    message.errorMsg(err)
  }
}
PPicError.UnKnow = 1000
PPicError.InVaildStorage = 1001
PPicError.QiniuConnect = 1002
PPicError.QiniuUpload = 1003

PPicError.GetUpdatePackage = 1100

error[PPicError.UnKnow] = '未知错误'
error[PPicError.InVaildStorage] = '无效的存储引擎配置'
error[PPicError.QiniuConnect] = '七牛连接错误'
error[PPicError.QiniuUpload] = '七牛上传失败'

error[PPicError.GetUpdatePackage] = '更新错误'

export default PPicError
