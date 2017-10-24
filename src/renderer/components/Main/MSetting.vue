<template>
  <div class="ppic-main-setting">
    <div class="tips">
      <div class="info">您尚未配置图床</div>
      <Button class="btn" type="primary" @click="openSetting">设 置</Button>
    </div>
  </div>
</template>
    
<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'MSetting',
  data() {
    return {
    }
  },
  methods: {
    openSetting: () => {
      ipcRenderer.send('openSetting', { replyMsg: 'open-setting-reply' })
    }
  }
}
</script>

<style lang="scss">
.ppic-main-setting {
  height: 600px;
  width: 100%;
  background: #d5d5d5 url(../../assets/background02.jpg) no-repeat fixed top;
  background-size: cover;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  .tips {
    width: 7rem;
    height: 4rem;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 2rem;
    .btn {
      opacity: 1;
    }
  }
}
</style>