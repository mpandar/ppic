<template>
  <div id="app">
    <transition-group name="fade">
      <MHeader key='mhead' v-if="!loading&&inited" :currentSelect="currentSelect" :copyLinkUrl="copyLinkUrl" :copyMarkdownUrl="copyMarkdownUrl"></MHeader>
      <MBody key='mbody' v-if="!loading&&inited" :selectImage="selectImage" :copyLinkUrl="copyLinkUrl" :copyMarkdownUrl="copyMarkdownUrl"></MBody>
      <MSetting key='msetting' v-if="!loading&&!inited"></MSetting>
    </transition-group>
    <div v-if="loading">
      <Spin size="large" fix v-if="loading">
        <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
        <div>加载中...</div>
      </Spin>
    </div>
    <MUpdate></MUpdate>
  </div>
</template>

<script>
import { ipcRenderer, clipboard } from 'electron'
import MHeader from '../../components/Main/MHeader'
import MBody from '../../components/Main/MBody'
import MSetting from '../../components/Main/MSetting'
import MUpdate from '../../components/Main/MUpdate'
export default {
  name: 'PPic',
  components: {
    MHeader, MBody, MSetting, MUpdate
  },
  methods: {
    copyLinkUrl: (item) => {
      clipboard.writeText(item.url)
      let myNotification = new Notification('已复制', {
        body: '链接已成功复制到剪切板',
        silent: true
      })
    },
    copyMarkdownUrl: (item) => {
      let markdown = `![` + item.remark + `](` + item.url + `)`
      clipboard.writeText(markdown)
      let myNotification = new Notification('已复制', {
        body: 'Markdown链接已成功复制到剪切板',
        silent: true
      })
    },
    selectImage: function (item) {
      this.currentSelect = item
      console.log('currentSelect', this.currentSelect)
    }
  },
  data () {
    return {
      currentSelect: {},
      loading: true,
      inited: false,
      update: null
      // {
      // version: '1.0.0',
      // update: '<h3>支持腾讯图床</h3>',
      // mac: {
      //   url: "http://localhost:9000/panda_photo-1.0.0.dmg",
      //   md5: "aaad"
      // }
      // }
    }
  },
  mounted: function () {
    ipcRenderer.send('app-config', { replyMsg: 'app-config-reply' })
    ipcRenderer.on('app-config-reply', (event, arg) => {
      console.log('app-config-reply', arg)
      if (arg.storages.length) {
        this.inited = true
      } else {
        this.inited = false
      }
      this.loading = false
      this.storages = arg.storages
      ipcRenderer.send('shortcut-regist', { shortcut: arg.config.shortcut, replyMsg: null, from: 'setting' })
    })

    ipcRenderer.on('ppic-error', (event, arg) => {
      this.$Message.error(arg.msg)
    })
  }
}
</script>


<style>
/* CSS */

#app {
  background: #d5d5d5;
}

.spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}

@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
