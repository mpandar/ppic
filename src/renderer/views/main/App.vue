<template>
  <div id="app">
    <Button type="primary" @click="openSetting">设 置</Button>
  </div>
</template>

<script>
const { ipcRenderer } = require('electron')
export default {
  name: 'PPic',
  methods: {
    openSetting: () => {
      ipcRenderer.send('openSetting', { replyMsg: 'config-reply' })
    }
  }
}
</script>


<style>
/* CSS */
</style>
