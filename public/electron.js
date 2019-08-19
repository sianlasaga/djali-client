const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const isDev = require('electron-is-dev')
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

var server
var services
// -- Services -- //
// Execute the server and service first before loading anything else.
if (process.platform.startsWith('win')) {
  var extob = path.join("external", "openbazaard.exe");
  var extserv = path.join("external", "services.exe");
  if (isDev) {
    extob = path.join("public", extob)
    extserv = path.join("public", extserv) 
    exec(`start ${extob} start --testnet`);
    exec(`start ${extserv}`)
  } else {
    
    server = spawn(extob,  ['start', '--testnet']);
    services = spawn(extserv,  []);
  }

} else if (process.platform.startsWith('linux')) {
  const extob = path.join("external", "openbazaard");
  const extserv = path.join("external", "services");
  if (isDev) {
    extob = path.join("public", extob)
    extserv = path.join("public", extserv) 
    exec(`exec ${extob} start --testnet`);
    exec(`exec ${extserv}`)

  } else {
    server = spawn(extob,  ['start', '--testnet']);
    services = spawn(extserv,  []);
  }
}

// -- Electron -- //
let mainWindow
const createWindow = () => {
  mainWindow = new BrowserWindow({
    title: 'Djali',
    width: 1200,
    height: 680,
    minWidth: 1200,
    minHeight: 680,
    center: true,
    icon: path.join(__dirname, 'favicon.ico'),
    autoHideMenuBar: true,
    frame:false,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + '/preload.js'
    }
  })
  mainWindow.loadURL(
    isDev ?
    'http://localhost:3000' :
    `file://${path.join(__dirname, '../build/index.html')}`
  )
  mainWindow.on('closed', () => (mainWindow = null))
}
app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (!isDev) {
    try { services.kill() } catch {}
    try { server.kill() } catch {}
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