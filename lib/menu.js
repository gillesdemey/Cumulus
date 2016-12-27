var Menu = require('electron').Menu

var template = [
  {
    label: 'Cumulus',
    submenu: [
      {
        label: 'About Cumulus',
        selector: 'orderFrontStandardAboutPanel:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide Cumulus',
        accelerator: 'CmdOrCtrl+H',
        selector: 'hide:'
      },
      {
        label: 'Hide Others',
        accelerator: 'CmdOrCtrl+Shift+H',
        selector: 'hideOtherApplications:'
      },
      {
        label: 'Show All',
        selector: 'unhideAllApplications:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        selector: 'terminate:'
      },
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        selector: 'undo:'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        selector: 'redo:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        selector: 'cut:'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        selector: 'copy:'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        selector: 'paste:'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        selector: 'selectAll:'
      }
    ]
  },
  {
    label: 'Jump to',
    submenu: [
      {
        label: 'Start',
        accelerator: '0',
        click (item, window) {
          window.webContents.send('JumpTo', 0)
        }
      },
      {
        label: '10%',
        accelerator: '1',
        click (item, window) {
          window.webContents.send('JumpTo', 10)
        }
      },
      {
        label: '20%',
        accelerator: '2',
        click (item, window) {
          window.webContents.send('JumpTo', 20)
        }
      },
      {
        label: '30%',
        accelerator: '3',
        click (item, window) {
          window.webContents.send('JumpTo', 30)
        }
      },
      {
        label: '40%',
        accelerator: '4',
        click (item, window) {
          window.webContents.send('JumpTo', 40)
        }
      },
      {
        label: '50%',
        accelerator: '5',
        click (item, window) {
          window.webContents.send('JumpTo', 50)
        }
      },
      {
        label: '60%',
        accelerator: '6',
        click (item, window) {
          window.webContents.send('JumpTo', 60)
        }
      },
      {
        label: '70%',
        accelerator: '7',
        click (item, window) {
          window.webContents.send('JumpTo', 70)
        }
      },
      {
        label: '80%',
        accelerator: '8',
        click (item, window) {
          window.webContents.send('JumpTo', 80)
        }
      },
      {
        label: '90%',
        accelerator: '9',
        click (item, window) {
          window.webContents.send('JumpTo', 90)
        }
      },
    ]
  },
]

module.exports = Menu.buildFromTemplate(template)
