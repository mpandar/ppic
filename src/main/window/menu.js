import { app, Menu, shell } from 'electron'
import window from './index'
const template = [
  {
    label: '视图',
    submenu: [
      { label: '刷新', role: 'reload' },
      { label: '强制刷新', role: 'forcereload' },
      { label: '开发者工具', role: 'toggledevtools' }
    ]
  },
  {
    label: '编辑',
    submenu: [
      { label: '撤销', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
      { label: '恢复', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
      { type: 'separator' },
      { label: '剪切', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: '复制', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: '粘贴', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      { label: '全选', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
    ]
  },
  {
    label: '帮助',
    submenu: [
      {
        label: '了解更多',
        click () {
          shell.openExternal('https://www.j2do.com')
        }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      { label: '关于', role: 'about' },
      { type: 'separator' },
      {
        label: '偏好设置...',
        click () {
          window.setting().open()
        }
      },
      { type: 'separator' },
      { role: 'services', submenu: [] },
      { type: 'separator' },
      { label: '退出', role: 'quit' }
    ]
  })
}

let menu = function () {
  console.log('menu.init')
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
export default menu
