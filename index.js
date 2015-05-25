'use strict';

var BrowserWindow  = require('browser-window')
var globalShortcut = require('global-shortcut')

var url            = require('url')
var querystring    = require('querystring')

var config         = require('./lib/config')

var menubar        = require('menubar')
var mb             = menubar({
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
var debugWindow = null

mb.on('ready', function() {

  if (debug)
    debugWindow = new BrowserWindow({
      width  : 995,
      height : 600,
      type   : 'desktop',
      frame  : true
    })

  function doLogin() {

    mb.window.loadUrl('https://soundcloud.com/connect?client_id=f17c1d67b83c86194fad2b1948061c9e&response_type=token&scope=non-expiring&display=next&redirect_uri=cumulus://oauth/callback')
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
  }

  /**
   * register Cumulus protocol
   */
  var protocol = require('protocol')
  protocol.registerProtocol('cumulus', function(req) {

    // parse access token
    var hash  = url.parse(req.url).hash.substr(1)
    var token = querystring.parse(hash).access_token

    config.set('access_token', token, function(err) {
      if (err)
        throw err
      else
        initialize()
    })

  })

  // check if we already have an access_token
  config.get('access_token', function(err, value) {
    if (err)
      throw err

    if (typeof value !== 'undefined')
      initialize()
    else
      doLogin()
  })

  function _sendGlobalShortcut(accelerator) {
    if (!mb.window) return
    mb.window.webContents.send('GlobalShortcuts', accelerator)
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
