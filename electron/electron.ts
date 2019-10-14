import { app, BrowserWindow, crashReporter, ipcMain, Menu, MenuItem, remote, shell } from 'electron'
import * as isDev from 'electron-is-dev'
import * as fs from 'fs'
import * as path from 'path'

import LocalServer from './LocalServer'

let mainWindow
let obServer
let djaliServices
let enableCrashReporting = false
const userPrefPath = path.join((app || remote.app).getPath('userData'), 'user-preferences.json')

if (!isDev && !process.argv.includes('--noexternal')) {
  const fileName =
    process.platform === 'linux' || process.platform === 'darwin'
      ? 'openbazaard'
      : 'openbazaard.exe'
  obServer = new LocalServer({
    name: 'Openbazaar',
    filePath: 'external',
    file: fileName,
  })
  djaliServices = new LocalServer({
    name: 'Djali services',
    filePath: 'external',
    file: fileName,
  })
  obServer.start(['start', '--testnet'])
  djaliServices.start()
}

if (!fs.existsSync(userPrefPath)) {
  console.log(`creating user preferences...`)
  fs.writeFile(userPrefPath, JSON.stringify({ enableCrashReporting: false }), err => {
    if (err) {
      console.log('Error creating user preferences file.')
    }
  })
} else {
  try {
    const userPref = JSON.parse(fs.readFileSync(userPrefPath, 'utf8'))
    enableCrashReporting = userPref.enableCrashReporting
  } catch (error) {
    console.log(`Error while reading user-preferences.json: ${error}`)
  }
}
console.log(enableCrashReporting)

crashReporter.start({
  productName: 'Djali',
  companyName: 'Djali Foundation',
  submitURL: 'http://localhost:1127/crashreports', // TODO: Update to deployed URL
  uploadToServer: enableCrashReporting,
})

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
  if (obServer) {
    obServer.stop()
  }
  if (djaliServices) {
    djaliServices.stop()
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
