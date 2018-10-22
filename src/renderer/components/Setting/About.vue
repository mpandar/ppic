<template>
  <div>
    <div>欢迎您使用PPic！</div><br>
    <div>PPic是我的一个业余项目，基于Electron+Vue，如果您想了解我开发这个项目前的思考可以看这里
      <a @click="openUrl" href='#'>基于Electron+Vue+iView的图床应用设计</a>。
    </div><br>
    <div>
      已知问题：由于默认读取图片后转格式为jpg，故导致上传png图片后，会将透明背景变成黑色。
    </div>
    <div>
      待更新内容清单：
    </div>
    <div>
      <Checkbox label="支持更多图床（微博、腾讯云等）" disabled>支持更多图床（微博、腾讯云等）</Checkbox><br>
      <Checkbox label="开机自动启动" disabled>开机自动启动</Checkbox><br>
      <Checkbox label="上传前图片压缩" disabled>上传前图片压缩</Checkbox><br>
      <Checkbox label="支持png、gif图片上传" disabled>支持png、gif图片上传</Checkbox><br>
      <Checkbox label="快捷键配置及修改" value=true disabled>快捷键配置及修改</Checkbox><br>
    </div>

  </div>
</template>

<script>
import { shell } from 'electron'
export default {
  name: 'About',
  data () {
    return {}
  },
  methods: {
    openUrl: function () {
      shell.openExternal('https://segmentfault.com/a/1190000010604983?_ea=2350630')
    }
  }
}
</script>