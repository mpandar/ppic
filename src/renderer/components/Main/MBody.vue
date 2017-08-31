<template>
  <div class="ppic-main-body">
    <waterfall :line-gap="180" :watch="images" style="overflow:inherit">
      <!-- each component is wrapped by a waterfall slot -->
      <waterfall-slot move-class="item-move" @click.native="selectImage(item)" v-for="(item, index) in images.rows" :width="item.width" :height="item.height+148" :order="index" :key="item.id">
        <div class="item" :class="{selected:item.selected}">
          <img class="thumbnail" :width="180" :src="'http://'+item.url">
          <div class="item-bottom">
            <div class="item-line">
              <span class="copy-btn" @click="copyLinkUrl(item)">
                <Icon type="link"></Icon>
              </span>
              <span class="copy-btn" @click="copyMarkdownUrl(item)">
                <Icon type="social-markdown"></Icon>
              </span>
            </div>
            <div class="item-line">
              <span class="pic-info">{{item.remark}}</span>
              <span class="pic-info"> {{item.createdAt.substring(0,16)}}</span>
            </div>
          </div>
        </div>
      </waterfall-slot>
    </waterfall>
  </div>
</template>
<script>
import Waterfall from 'vue-waterfall/lib/waterfall'
import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'
import { ipcRenderer } from 'electron'
export default {
  components: {
    Waterfall,
    WaterfallSlot
  },
  name: 'MBody',
  props: ['copyLinkUrl', 'copyMarkdownUrl', 'selectImage'],
  data() {
    return {
      images: {
        count: 0,
        rows: []
      }
    }
  },
  methods: {

  },
  beforeMount: function () {
    ipcRenderer.send('pics-fetch',
      {
        page: 1,
        replyMsg: 'pics-fetch-reply'
      })
    ipcRenderer.on('pics-fetch-reply', (event, arg) => {
      console.log('pics-fetch-reply', arg)
      this.images.count += arg.count
      this.images.rows = this.images.rows.concat(arg.rows)
    })
    ipcRenderer.on('pics-upload-reply', (event, arg) => {
      this.images.count++
      this.images.rows.unshift(arg)
      this.$Message.success('上传成功');
    })
  }
}
</script>

<style>
.ppic-main-body {
  margin: 0.1rem 0;
  overflow-y: auto;
  height: 30rem;
}

.item {
  display: flex;
  flex-direction: column;
}

.item * {
  display: flex;
}

.thumbnail {
  padding: 0.2rem;
  border: 0.05rem solid #d5d5d5;
  border-bottom-width: 0;
  background: #fff;
}

.item-bottom {
  background: #fff;
  border: 0.05rem solid #d5d5d5;
  border-top-width: 0;
}

.item-bottom {
  flex-direction: row;
  padding: 0.2rem;
}

.item-line {
  flex-direction: column;
  flex-grow: 1;
}



.item-line .copy-btn {
  font-size: 1rem;
  background: #FF6060;
  border-radius: 0.3rem;
  color: #fff;
  width: 1.5rem;
  justify-content: center;
  margin: 0.1rem;
}

.item-line .copy-btn:hover {
  background: #2d8cf0;
  transition: background 0.2s linear;
  cursor: pointer;
}


.item-line .pic-info {
  justify-content: flex-end;
}

.item-move {
  transition: all .5s cubic-bezier(.55, 0, .1, 1);
}
</style>
