<template>
  <div class="ppic-main-header" :watch="currentSelect">
    <div class="upload">
      <Upload multiple type="drag" :before-upload="upload" action="#">
        <div style="padding: 10px 0;height:5rem;">
          <Icon type="ios-cloud-upload" size="42" style="color: #3399ff"></Icon>
          <p>点击或拖拽上传</p>
        </div>
      </Upload>
    </div>
    <div class="pic-info">
      <div class="pic-info-line">
        <Input v-model="linkUrl" disabled>
        <span slot="prepend" class="label">Link:</span>
        <span slot="append" class="copy-btn" @click="copyLinkUrl(currentSelect)">
          <Icon type="link"></Icon>
        </span>
        </Input>
      </div>
      <div class="pic-info-line">
        <Input v-model="markdownUrl" disabled>
        <span slot="prepend" class="label">Markdown:</span>
        <span slot="append" class="copy-btn" @click="copyMarkdownUrl(currentSelect)">
          <Icon type="social-markdown"></Icon>
        </span>
        </Input>
      </div>
  
    </div>
  </div>
</template>
<script>
import { ipcRenderer } from 'electron'
const AUTO = 0
const HTTP = 1
const HTTPS = 2
export default {
  name: 'MHeader',
  props: ['copyLinkUrl', 'copyMarkdownUrl', 'currentSelect'],
  data() {
    return {
    }
  },
  methods: {
    upload: function (file) {
      console.log(file)
      ipcRenderer.send('pics-upload', { replyMsg: 'pics-upload-reply', img: file.path })
      return false
    }
  },
  beforeMount: function () {

  },
  computed: {
    linkUrl: function () {
      console.log('linkUrl', this.currentSelect)
      return this.currentSelect.url ? 'http://' + this.currentSelect.url : ''
    },
    markdownUrl: function () {
      return this.currentSelect.remark ? `![` + this.currentSelect.remark + `](` + this.currentSelect.url + `)` : ''
    }

  },
}
</script>

<style lang="scss">
.ppic-main-header {
  display: flex;
  background: #fff;
  height: 5.5rem;
  .upload {
    flex: 1;
    margin: 0.2rem 0 0.2rem 0.2rem;
  }

  .pic-info {
    flex: 6;
    margin: 0.1rem 0;
    background: #fff;
    .pic-info-line {
      margin: 0.4rem;
      .ivu-input[disabled] {
        color: #666;
      }
      .label {
        display: block;
        width: 4rem;
      }
      .copy-btn {
        display: flex;
        font-size: 1rem;
        background: #FF6060;
        border-radius: 0.3rem;
        color: #fff;
        width: 1.5rem;
        justify-content: center;
        margin: 0.1rem;
        &:hover {
          background: #2d8cf0;
          transition: background 0.2s linear;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
