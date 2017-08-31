import qn from 'qn'
class Qiniu {
  constructor(accessKey, secretKey, bucket, origin, url) {
    this.client = null
    this.accessKey = accessKey
    this.secretKey = secretKey
    this.bucket = bucket
    this.origin = origin
    this.storeType = 'qiniu'
    this.url = url
    console.log('Qiniu', accessKey, secretKey, bucket, origin)
  }
  connect() {
    if (this.client) return this.client
    this.client = qn.create({
      accessKey: this.accessKey, // 'y9Ehh4K2i6o4IjCu8kvo0dT319kk2MS3Xbx6O9nJ',
      secretKey: this.secretKey, // 'V-fzA71AJ1oRnLHcJN4YAYl7yoOaz2kFW0MuakJj',
      bucket: this.bucket, // 'resources',
      origin: this.origin // 'up-z1.qiniu.com'
      // timeout: 3600000, // default rpc timeout: one hour, optional
      // if your app outside of China, please set `uploadURL` to `http://up.qiniug.com/`
      // uploadURL: 'http://up.qiniu.com/',
    })
    console.log('qiniu connect', this.client)
    return this.client
  }

  upload(img, fileName, width, height) {
    let client = this.connect()
    let buffer = img.toJPEG(50)
    return new Promise((resolve, reject) => {
      client.upload(buffer, { key: fileName }, (err, result) => {
        if (err) {
          console.log('err', err)
        }
        resolve(result)
      })
    })
  }
}

export default Qiniu