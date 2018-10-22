<template>
  <div class="ppic-setting-picset">
    <div class="ppic-setting-left">
      <Table highlight-row stripe :columns="columns" :height=320 :data="storages" @on-current-change="editStorage"></Table>
      <Select label-in-value ref="storageSelect" clearable @on-change="addStorage" class="ppic-setting-add-btn" remote size="small" placement="top" style="width:70px" placeholder="+增加">
        <Option v-for="item in supportStorages" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <div class="ppic-setting-right">
      <Input size="small" v-model='currentStorage.storeName'>
      <span style='width:2rem' slot="prepend">存储别名</span>
      </Input>
      <br>
      <Input size="small" readonly disabled v-model='currentStorage.storeType'>
      <span style='width:2rem' slot="prepend">存储引擎</span>
      </Input>
      <br>
      <Input size="small" v-model='currentStorage.accessKey'>
      <span style='width:2rem' slot="prepend">Access Key</span>
      </Input>
      <br>
      <Input size="small" v-model='currentStorage.secretKey'>
      <span slot="prepend">Secret Key</span>
      </Input>
      <br>
      <Input size="small" v-model='currentStorage.bucket'>
      <span slot="prepend">Bucket</span>
      </Input>
      <br>
      <Input size="small" v-model='currentStorage.origin'>
      <Select @on-change="selectUploadUrl" slot="append" style="width: 80px" placement="top">
        <Option value="http://up-z2.qiniup.com">华南</Option>
        <Option value="http://up.qiniup.com">华东</Option>
        <Option value="http://up-z1.qiniup.com">华北</Option>
        <Option value="http://up-na0.qiniup.com">北美</Option>
      </Select>
      <span slot="prepend">Upload URL</span>
      </Input>
      <br>
      <Input size="small" v-model='currentStorage.url'>
      <span slot="prepend">Url</span>
      </Input>
      <br>
      <div class='ppic-setting-btn'>
        <Button class='ppic-setting-save-btn' size='small' type="success" @click.native="saveStorage">保存</Button>
        <Button v-if="currentStorage.id" class='ppic-setting-del-btn' size='small' type="error" @click.native="confirmRemoveStorage">删除</Button>
      </div>
    </div>
    <Modal v-model="confirmRemove" width="30rem">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>删除此图床并不影响之前存储的图片</p>
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="removeStorage">删除</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'PicConfig',
  data () {
    return {
      columns: [
        {
          title: '图床类型',
          key: 'storeName'
        }
      ],
      storages: [],
      supportStorages: [
        {
          value: 'qiniu',
          label: '七牛'
        }
        // {
        //   value: 'tencent',
        //   label: '万象优图'
        // }
      ],
      currentStorage: {
      },
      confirmRemove: false
    }
  },
  methods: {
    changeSelect (name) {
      this.activeName = name
    },
    addStorage (item) {
      console.log('addStorage', item)
      if (item.value != '') {
        this.currentStorage = {}
        this.currentStorage.storeType = item.value
        this.currentStorage.storeName = item.label
      }
      this.$refs.storageSelect.clearSingleSelect()
    },
    editStorage (currentRow, oldCurrentRow) {
      this.currentStorage = currentRow
      console.log(currentRow, oldCurrentRow)
    },
    saveStorage () {
      ipcRenderer.send('storage-save',
        {
          storage: this.currentStorage,
          replyMsg: 'storage-save-reply',
          from: 'setting'
        })
    },
    confirmRemoveStorage () {
      if (this.storages.length <= 1) {
        this.$Message.warning('请至少保留一个存储图床')
        return
      }
      this.confirmRemove = true
    },
    removeStorage () {
      ipcRenderer.send('storage-remove',
        {
          id: this.currentStorage.id,
          replyMsg: 'storage-remove-reply',
          from: 'setting'
        })
    },
    selectUploadUrl (value) {
      this.$set(this.currentStorage, 'origin', value)
      console.log(this.currentStorage)
    }
  },
  beforeMount: function () {
    ipcRenderer.send('storage-config', { replyMsg: 'storage-config-reply', from: 'setting' })
    ipcRenderer.on('storage-config-reply', (event, arg) => {
      console.log('item', arg)
      this.storages = arg
    })

    ipcRenderer.on('storage-save-reply', (event, arg) => {
      console.log('item', arg)
      if (arg.isNew === true) {
        delete arg.isNew
        this.storages.push(arg)
      } else {
        this.storages = this.storages.map(t => {
          return t.id === arg.id
            ? arg
            : t
        })
      }
      this.$Message.success('图床『' + arg.storeName + '』已经保存成功！')
      this.currentStorage = arg
    })
    ipcRenderer.on('storage-remove-reply', (event, arg) => {
      console.log('item', arg)
      this.currentStorage = {}
      this.storages = this.storages.filter(function (obj) {
        return arg.id !== obj.id
      })
      this.confirmRemove = false
      this.$Message.success('图床『' + arg.storeName + '』已经删除！')
    })
  }
}
</script>

<style>
.ppic-setting-add-btn .ivu-select-placeholder {
  text-align: center;
  background: #2d8cf0;
  color: #fff !important;
  padding: 0 !important;
}

.ppic-setting-picset {
  display: flex;
  flex: 1 0 auto;
}

.ppic-setting-left {
  flex-basis: 15rem;
}

.ppic-setting-right {
  flex-basis: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 1.5rem;
}

.ppic-setting-right .ivu-input-group-prepend {
  width: 5rem;
}

.ppic-setting-save-btn,
.ppic-setting-del-btn {
  margin-right: 1rem;
}

.ppic-setting-btn {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .ivu-modal {
    width: 30rem !important;
    margin: 0 auto;
  }
}
</style>
