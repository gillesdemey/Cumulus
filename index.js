'use strict';

var electron       = require('electron')
var App            = electron.app
var BrowserWindow  = electron.BrowserWindow
var globalShortcut = electron.globalShortcut
var Menu           = electron.Menu

var url            = require('url')
var querystring    = require('querystring')
var Path           = require('path')

var settings       = require('electron-settings')
settings.setPath(
  Path.resolve(App.getPath('userData'), 'config.json')
)

var menubar        = require('menubar')
var mb             = menubar({
  icon          : __dirname + '/app/IconTemplate.png',
  dir           : __dirname + '/app',
  preloadWindow : true, // TODO: enable if already logged in
  width         : 400,
  height        : 500,
  resizable     : false
})

var debug = process.env.NODE_ENV === 'development'

/**
 * Window references
 */
var debugWindow, loginWindow

mb.on('ready', function() {

  Menu.setApplicationMenu(require('./lib/menu'));

  function doLogin() {
    loginWindow = new BrowserWindow({
      width: 400,
      height: 500,
      resizable: false,
      webPreferences: {
        nodeIntegration: false
      }
    })
    loginWindow.on('close', App.quit)
    loginWindow.loadURL('https://soundcloud.com/connect?client_id=f17c1d67b83c86194fad2b1948061c9e&response_type=token&scope=non-expiring&display=next&redirect_uri=cumulus://oauth/callback')
  }

  function initialize() {
    if (!debug) {
      mb.window.setSize(320, 500)
      mb.window.setMaximumSize(320, 600)
      mb.window.setMinimumSize(320, 400)
    } else {
      mb.window.setSize(620, 700)
      mb.window.setMaximumSize(1220, 800)
      mb.window.setMinimumSize(620, 600)
    }

    mb.window.setResizable(true)
    mb.window.loadURL('file://' + __dirname + '/app/index.html')
    mb.window.on('focus', function() { _sendWindowEvent('focus') })
    if (debug) {
      mb.window.openDevTools()
    }
  }

  /**
   * register Cumulus protocol
   */
  var protocol = electron.protocol
  protocol.registerHttpProtocol('cumulus', function(req) {

    var uri = url.parse(req.url)

    switch (uri.host) {
      case 'oauth':
        if (uri.pathname !== '/callback') return;

        // parse access token
        var hash  = uri.hash.substr(1)
        var token = querystring.parse(hash).access_token

        settings.set('access_token', token)
        if (loginWindow) {
          loginWindow.removeListener('close', App.quit)
          loginWindow.close()
        }
        initialize()
        break

      case 'logout':
        settings.delete('access_token')
        doLogin()
        break
    }

  })

  // check if we already have an access_token
  settings.has('access_token')
    ? initialize()
    : doLogin()

  function _sendGlobalShortcut(accelerator) {
    if (!mb.window) return
    mb.window.webContents.send('GlobalShortcuts', accelerator)
  }

  function _sendWindowEvent(name) {
    if (!mb.window) return
    mb.window.webContents.send('WindowEvent', name)
  }

  globalShortcut.register('MediaPlayPause', function() {
    _sendGlobalShortcut('MediaPlayPause')
  })

  globalShortcut.register('MediaNextTrack', function() {
    _sendGlobalShortcut('MediaNextTrack')
  })

  globalShortcut.register('MediaPreviousTrack', function() {
    _sendGlobalShortcut('MediaPreviousTrack')
  })

  globalShortcut.register('CommandOrControl+Alt+L', () => {
    _sendGlobalShortcut('SoundCloudLikeTrack')
  })


})
