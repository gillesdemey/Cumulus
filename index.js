'use strict';

var BrowserWindow  = require('browser-window')
var globalShortcut = require('global-shortcut')
var Menu           = require('menu')

var url            = require('url')
var querystring    = require('querystring')

var config         = require('./lib/config')

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

  if (debug)
    debugWindow = new BrowserWindow({
      width  : 995,
      height : 600,
      type   : 'desktop',
      frame  : true
    })

  function doLogin() {
    loginWindow = new BrowserWindow({
      width: 400,
      height: 500,
      resizable: false,
      'node-integration': false
    })
    loginWindow.loadUrl('https://soundcloud.com/connect?client_id=f17c1d67b83c86194fad2b1948061c9e&response_type=token&scope=non-expiring&display=next&redirect_uri=cumulus://oauth/callback')
  }

  function initialize() {

    if (debug) {
      debugWindow.openDevTools()
      debugWindow.loadUrl('file://' + __dirname + '/app/index.html')
    }

    mb.window.setSize(320, 500)
    mb.window.setMaximumSize(320, 600)
    mb.window.setMinimumSize(320, 400)
    mb.window.setResizable(true)
    mb.window.loadUrl('file://' + __dirname + '/app/index.html')
    mb.window.on('focus', function() { _sendWindowEvent('focus') })
  }

  /**
   * register Cumulus protocol
   */
  var protocol = require('protocol')
  protocol.registerHttpProtocol('cumulus', function(req) {

    var uri = url.parse(req.url)
    console.log('Action', uri.host)

    switch (uri.host) {
      case 'oauth':
        if (uri.pathname !== '/callback') return;

        // parse access token
        var hash  = uri.hash.substr(1)
        var token = querystring.parse(hash).access_token

        config.set('access_token', token, function(err) {
          if (err) throw err
          if (loginWindow) loginWindow.close()
          initialize()
        })
        break

      case 'logout':
        config.set('access_token', null, function(err) {
          if (err) throw err
          doLogin()
        })
        break
    }

  })

  // check if we already have an access_token
  config.get('access_token', function(err, value) {
    if (err)
      throw err

    if (typeof value !== 'undefined' && value !== null)
      initialize()
    else
      doLogin()
  })

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

})
