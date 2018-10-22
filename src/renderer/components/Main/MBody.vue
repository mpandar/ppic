<template>
  <div class="ppic-main-body" id="main-body" v-on:scroll="scrollToButtom">
    <waterfall ref="waterfall" :line-gap="180" :watch="images" style="overflow:inherit;display:flex">
      <!-- each component is wrapped by a waterfall slot -->
      <waterfall-slot move-class="item-move" @click.native="selectImage(item)" v-for="(item, index) in images.rows" :width="item.width" :height="item.height+(item.width/180)*54" :order="index" :key="item.id">
        <div class="item" :class="{selected:item.selected}">
          <img class="thumbnail" :width="180" :src="getUrl(item.url)">
          <div class="item-bottom ">
            <div class="item-line ">
              <span class="copy-btn " @click="copyLinkUrl(item) ">
                <Icon type="link "></Icon>
              </span>
              <span class="copy-btn " @click="copyMarkdownUrl(item) ">
                <Icon type="social-markdown "></Icon>
              </span>
            </div>
            <div class="item-line ">
              <div class="pic-info pic-info-remark " @click="editRemark(item) ">
                <Icon type="leaf "></Icon>
                <span>{{item.remark}}</span>
              </div>
              <span class="pic-info "> {{item.createdAt.substring(0,16)}}</span>
            </div>
          </div>
        </div>
      </waterfall-slot>
    </waterfall>
    <div v-if="images.count==0 " class="no-image-tips ">
      暂时还没有上传图片哦！
    </div>
    <div v-if="images.count " class="ppic-body-bottom " v-show="noMore ">已经没有更多了~</div>
    <Modal v-model="editor.modal " title="编辑图片备注信息 " @on-ok="editOk ">
      <Input autofocus v-model="editor.remark "></Input>
    </Modal>
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
  data () {
    return {
      page: 1,
      noMore: false,
      editor: {
        modal: false,
        currentItem: {},
        remark: ''
      },
      images: {
        count: 0,
        rows: []
      },
      loading: false
    }
  },
  methods: {
    scrollToButtom: function () {
      let ele = this.$el
      console.log('scrollTop,scrollHeight', ele.scrollTop, ele.scrollHeight)
      if (ele.scrollTop + 510 > ele.scrollHeight) {
        this.picsFetchMore()
      }
    },
    picsFetchMore: function () {
      if (this.loading || this.noMore) return
      this.loading = true
      ipcRenderer.send('pics-fetch',
        {
          page: this.page,
          size: 10,
          replyMsg: 'pics-fetch-reply'
        })
    },
    editRemark: function (item) {
      this.editor.currentItem = item
      this.editor.remark = item.remark
      this.editor.modal = true
    },
    editOk: function () {
      this.editor.currentItem.remark = this.editor.remark
    },
    getUrl: function (url) {
      let str = 'http://'
      return str + url.trim()
    }
  },
  updated: function () {
    let waterfall = this.$refs.waterfall.$el
    console.log(this.$refs.waterfall.$el)
    if (waterfall.scrollHeight > 0 && (waterfall.scrollHeight < this.$el.scrollHeight)) {
      this.picsFetchMore()
    }
    console.log('scrollTop,scrollHeight', waterfall.scrollHeight, this.$el.scrollHeight)
  },
  beforeMount: function () {
    this.picsFetchMore()
    ipcRenderer.on('pics-fetch-reply', (event, arg) => {
      if (arg.rows.length) {
        this.page++
      } else {
        this.noMore = true
      }
      this.images.count += arg.rows.length
      this.images.rows = this.images.rows.concat(arg.rows)
      console.log(arg.rows)
      this.loading = false
    })
    ipcRenderer.on('pics-upload-reply', (event, arg) => {
      this.images.count++
      this.images.rows.unshift(arg)
      this.$Message.success('上传成功')
    })
  }
}
</script>

<style lang="scss">
.vue-waterfall-slot {
  position: absolute;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.vue-waterfall{
  position: relative;
}
.ppic-main-body {
  margin: 0.1rem 0;
  overflow-y: auto;
  height: 31.8rem;
  .ppic-body-bottom {
    text-align: center;
    padding: 1.5rem;
  }
  .no-image-tips {
    height: 20rem;
    align-content: center;
    text-align: center;
    line-height: 20rem;
  }
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


.item-line {
  .pic-info {
    justify-content: flex-end;
    align-items: center;
  }
  .pic-info-remark {
    .ivu-icon {
      display: none;
    }
    &:hover {
      cursor: pointer;
      .ivu-icon {
        display: block;
      }
    }
  }
}


.item-move {
  transition: all .5s cubic-bezier(.55, 0, .1, 1);
}
</style>
