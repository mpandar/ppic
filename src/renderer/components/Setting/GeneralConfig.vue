<template>
  <div class="ppic-setting-picset">
    <Checkbox v-model="autostart" label="开机自动启动">开机自动启动</Checkbox>
    <br>
    <br>
    <Checkbox v-model="autozip" label="上传前压缩图片">上传前压缩图片</Checkbox>
  </div>
</template>
<script>
export default {
  name: 'GeneralConfig',
  data() {
    return {
    }
  },
  methods: {

  }
}
</script>

<style>

</style>
