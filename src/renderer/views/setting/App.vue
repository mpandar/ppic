<template>
  <div>
    <Menu class="ppic-menu" mode="horizontal" active-name="2" @on-select="changeSelect">
      <Menu-item name="1">
        <div class="ppic-menu-item">
          <Icon type="home"></Icon>
          <div class="ppic-menu-item-text"> 通用</div>
        </div>
      </Menu-item>
      <Menu-item name="2">
        <div class="ppic-menu-item">
          <Icon type="images"></Icon>
          <div class="ppic-menu-item-text">图床</div>
        </div>
      </Menu-item>
      <Menu-item name="3">
        <div class="ppic-menu-item">
          <Icon type="person"></Icon>
          <div class="ppic-menu-item-text">关于</div>
        </div>
      </Menu-item>
    </Menu>
    <div class="ppic-setting-body">
      <GeneralConfig v-if="activeName=='1'"></GeneralConfig>
      <PicConfig v-if="activeName=='2'"></PicConfig>
      <div v-if="activeName=='3'">
        3333
      </div>
    </div>
  </div>
</template>
<script>
import PicConfig from '../../components/Setting/PicConfig'
import GeneralConfig from '../../components/Setting/GeneralConfig'
export default {
  name: 'Setting',
  components: {
    PicConfig, GeneralConfig
  },
  data() {
    return {
      activeName: "2",
      autostart: true,
      autozip: true,
      columns: [
        {
          title: '图床类型',
          key: 'name'
        }
      ],
      storages: [
        { name: '七牛' }
      ],
      supportStorages: [
        {
          value: 'qiniu',
          label: '七牛'
        },
        {
          value: 'tencent',
          label: '万象优图'
        }
      ]
    }
  },
  methods: {
    changeSelect(name) {
      this.activeName = name
    },
    addStorage(value) {
      console.log(this.$refs.storageSelect)
      this.$refs.storageSelect.clearSingleSelect()
    }
  }
}
</script>

<style>
.ppic-menu {
  background: #ececec;
}

.ppic-menu .ppic-menu-item {
  line-height: 2.4rem;
}

.ppic-menu .ppic-menu-item-text {
  font-size: 0.7rem;
  line-height: 0.7rem;
}

.ppic-menu .ivu-menu-horizontal .ivu-menu-item {
  line-height: 2.4rem;
}

.ppic-menu .ivu-menu-item {
  font-size: 2rem;
  text-align: center;
}



.ppic-menu .ivu-menu-item i {
  margin-right: 0;
}

.ppic-menu .ivu-menu-item-selected {
  background: #fff;
}

.ppic-menu .ivu-menu-horizontal .ivu-menu-item-active {
  color: #222;
}

.ppic-setting-body {
  padding: 1.5rem;
}
</style>
