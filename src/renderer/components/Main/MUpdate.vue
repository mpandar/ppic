<template>
  <div>
    <Modal width="360" v-model="updateModal">
      <p slot="header" style="color:#2d8cf0;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>新版本V{{upgrade.version}}升级提示</span>
      </p>
      <div style="text-align:center" v-html="upgrade.update">
      </div>
      <div slot="footer" class="footer">
        <!-- <Button type="error" @click="download">后台下载</Button> -->
        <Button type="error" @click="downloadByBrowser">直接下载</Button>
        <Button type="ghost" @click="cancel">暂不更新</Button>
      </div>
    </Modal>
    <Modal v-model="upgradeConfirm" title="新版本更新" @on-ok="onOk" @on-cancel="onCancel" width="30rem" ok-text="立即更新">
      <div v-html="upgrade.update"></div>
    </Modal>
  </div>
</template>
    
<script>
import { ipcRenderer, remote, shell, clipboard } from 'electron'
export default {
  name: 'MUpdate',
  data() {
    return {
      upgrade: {},
      updateModal: false,
      upgradeConfirm: false,
      downloadFile: ''
    }
  },
  methods: {
    getUrlByPlatform: function() {
      let process = remote.process
      console.log("process.platform", process.platform)
      switch (process.platform) {
        case 'darwin':
          return this.upgrade.mac
      }
    },
    download: function() {
      let file = this.getUrlByPlatform()
      ipcRenderer.send('download', { replyMsg: 'download-reply', file: file, udpate: this.upgrade.update })
      this.updateModal = false
    },
    downloadByBrowser: function() {
      let file = this.getUrlByPlatform()
      clipboard.writeText(file.url)
      console.log('downloadByBrowser', file)
      this.$Message.success('已复制下载地址到剪切板，如果自动调用下载失败，请手动复制后下载！Mac下Chrome加迅雷下载失败，请使用Safrai！');
      setTimeout(() => {
        shell.openExternal(file.url, false)
      }, 3000)

    },
    cancel: function() {
      this.updateModal = false
      this.upgradeConfirm = false
    },
    onOk: function() {
      shell.openItem(this.downloadFile)
    },
    onCancel: function() {
      this.$Message.success('升级文件 ' + this.downloadFile + ' 已下载，请手动更新！');
    }
  },
  mounted: function() {
    ipcRenderer.on('download-reply', (event, arg) => {
      this.downloadFile = arg.file
      this.upgradeConfirm = true
    })
    ipcRenderer.on('new-version', (event, arg) => {
      console.log('new-version', arg, this, this.upgrade)
      this.updateModal = true
      this.upgrade = arg
      this.$Modal.success({
        title: 'PPic有新版本更新啦（v' + arg.version + '）',
        content: arg.update
      });
    })
  }
}
</script>

<style lang="scss">
.footer {
  display: flex;
  justify-content: center;
}
</style>