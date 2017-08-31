<template>
  <div id="app">
    <MHeader :currentSelect="currentSelect" :copyLinkUrl="copyLinkUrl" :copyMarkdownUrl="copyMarkdownUrl"></MHeader>
  
    <MBody :selectImage="selectImage" :copyLinkUrl="copyLinkUrl" :copyMarkdownUrl="copyMarkdownUrl"></MBody>
    <Button type="primary" @click="openSetting">设 置</Button>
  </div>
</template>

<script>
import { ipcRenderer, clipboard } from 'electron'
import MHeader from '../../components/Main/MHeader'
import MBody from '../../components/Main/MBody'
export default {
  name: 'PPic',
  components: {
    MHeader, MBody
  },
  methods: {
    openSetting: () => {
      ipcRenderer.send('openSetting', { replyMsg: 'open-setting-reply' })
    },
    copyLinkUrl: (item) => {
      clipboard.writeText(item.url)
      let myNotification = new Notification('已复制', {
        body: '链接已成功复制到剪切板',
        icon: "newsong.svg", silent: true
      })
    },
    copyMarkdownUrl: (item) => {
      let markdown = `![` + item.remark + `](` + item.url + `)`
      clipboard.writeText(markdown)
      let myNotification = new Notification('已复制', {
        body: 'Markdown链接已成功复制到剪切板',
        icon: "newsong.svg", silent: true
      })
    },
    selectImage: function (item) {
      this.currentSelect = item
      console.log('currentSelect', this.currentSelect)
    }
  },
  data() {
    return {
      currentSelect: {}
    }

  },
  mounted: function () {
    ipcRenderer.send('storage-config', { replyMsg: 'storage-config-reply' })
    ipcRenderer.on('storage-config-reply', (event, arg) => {
      // console.log('item', arg)
    })
  }
}
</script>


<style>
/* CSS */

#app {
  background: #d5d5d5;
}
</style>
