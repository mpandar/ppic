<template>
  <div class="ppic-setting-genset">
    <div class="item-line">
      <Checkbox v-model="config.autostart" disabled>开机自动启动（暂未支持）</Checkbox>
    </div>
    <div class="item-line">
      <Checkbox v-model="config.autozip.on" disabled>上传前压缩图片（暂未支持）</Checkbox>
    </div>
    <div class="item-line">
      <span class="label">选择上传图床：</span>
      <CheckboxGroup v-model="config.storages" v-if='storages.length!=0'>
        <Checkbox v-for="item in storages" :label="item.id" :key="item.id">{{item.storeName}}</Checkbox>
      </CheckboxGroup>
      <div v-if='storages.length==0'>请先配置图床</div>
    </div>
    <div class="item-line">
      快捷键配置：
      <Input v-model="config.shortcut" style="width: 200px" readonly></Input>
      &nbsp;&nbsp;
      <a href="#" @click="changeShortCut">{{shortcutTitle}}</a>
    </div>
    <br>
    <br>
    <Button type="success" size="small" @click="saveConfig">保存</Button>
  </div>
</template>
<script>
import { ipcRenderer } from 'electron'
import Mousetrap from 'mousetrap'
import 'mousetrap/plugins/record/mousetrap-record.min.js'
export default {
  name: 'GeneralConfig',
  data() {
    return {
      config: {
        autostart: false,
        autozip: {
          on: false
        },
        storages: [],
        shortcut: 'Command+Ctrl+C'
      },
      storages: [],
      shortcutTitle: "点我后直接按键"
    }
  },
  methods: {
    saveConfig: function() {
      console.log("config", this.config)
      ipcRenderer.send('update-config', { replyMsg: 'update-config-reply', from: "setting", config: this.config })
    },
    changeShortCut: function() {
      this.shortcutTitle = "请按下快捷键（请注意，如果显示按键与您实际按键不一致，是由于快捷键冲突，请重按！）"
      Mousetrap.record((sequence) => {
        // sequence is an array like ['ctrl+k', 'c']
        console.log(this.config, sequence)
        this.shortcutTitle = "点我后直接按键"
        this.$set(this.config, 'shortcut', sequence.join('+'))
      });
    }
  },
  beforeMount: function() {
    ipcRenderer.send('app-config', { replyMsg: 'app-config-reply', from: "setting" })
    ipcRenderer.on('app-config-reply', (event, arg) => {
      console.log('app-config-reply', arg)
      this.config = arg.config
      this.storages = arg.storages
    })
    ipcRenderer.on('update-config-reply', (event, arg) => {
      ipcRenderer.send('shortcut-regist', { shortcut: this.config.shortcut, replyMsg: null, from: "setting" })
      this.$Message.success('保存成功');
    })
  }
}
</script>

<style lang="scss">
.ppic-setting-genset {

  .item-line {
    height: 2rem;
    display: flex;
    align-items: center;
    .label {
      margin-top: 1px;
    }
  }
}
</style>
