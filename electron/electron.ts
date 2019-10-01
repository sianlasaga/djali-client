import { spawn } from 'child_process'
import { app, BrowserWindow, ipcMain, Menu, MenuItem, shell } from 'electron'
import * as isDev from 'electron-is-dev'
import * as fs from 'fs'
import * as path from 'path'

let server
let services

if (!isDev && !process.argv.includes('--noexternal')) {
  if (process.platform.startsWith('win')) {
    const extob = path.join('external', 'openbazaard.exe')
    const extserv = path.join('external', 'services.exe')
    server = spawn(extob, ['start', '--testnet'])
    services = spawn(extserv, [])
  } else if (process.platform.startsWith('linux')) {
    const extob = path.join('external', 'openbazaard')
    const extserv = path.join('external', 'services')
    server = spawn(extob, ['start', '--testnet'])
    services = spawn(extserv, [])
  }
}

let mainWindow

const createWindow = async () => {
  const helpSubmenu = {
    label: 'Help',
    submenu: [
      {
        label: 'Website',
        click() {
          shell.openExternal('https://djali.org')
        },
      },
    ],
  }

  const menuTemplate = [
    new MenuItem({ role: 'editMenu' }),
    new MenuItem({ role: 'viewMenu' }),
    new MenuItem({ role: 'windowMenu' }),
    helpSubmenu,
  ]

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  ipcMain.on('contextmenu', () => {
    menu.popup()
  })

  await app.whenReady()
  mainWindow = new BrowserWindow({
    title: 'Djali',
    width: 1200,
    height: 680,
    minWidth: 1200,
    minHeight: 680,
    center: true,
    icon: path.join(__dirname, 'favicon.ico'),
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      preload: __dirname + '/preload.js',
    },
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
  } else {
    mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
  }
  mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  // if (obServer) {
  //   obServer.stop()
  // }
  // if (djaliServices) {
  //   djaliServices.stop()
  // }

  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
