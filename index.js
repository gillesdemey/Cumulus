'use strict';

var app            = require('app')
var BrowserWindow  = require('browser-window')
var globalShortcut = require('global-shortcut')

var url            = require('url')
var querystring    = require('querystring')

var config         = require('./lib/config')

/**
 * Window references
 */
var mainWindow  = null
var loginWindow = null

app.on('ready', function() {

  function doLogin() {

    loginWindow = new BrowserWindow({
      width  : 500,
      height : 500,
      center : true,
      type   : 'splash'
    })

    loginWindow.loadUrl('https://soundcloud.com/connect?client_id=f17c1d67b83c86194fad2b1948061c9e&response_type=token&scope=non-expiring&display=next&redirect_uri=cumulus://oauth/callback')
  }

  function initialize() {
    if (loginWindow)
      loginWindow.close()

    mainWindow.loadUrl('file://' + __dirname + '/app/index.html')
    mainWindow.show()
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


  mainWindow = new BrowserWindow({
    'width'    : 960,
    'height'   : 600,
    'min-width': 900,
  })

  globalShortcut.register('MediaPlayPause', function() {
    mainWindow.webContents.send('GlobalShortcuts', 'MediaPlayPause')
  })

  globalShortcut.register('MediaNextTrack', function() {
    mainWindow.webContents.send('GlobalShortcuts', 'MediaNextTrack')
  })

  globalShortcut.register('MediaPreviousTrack', function() {
    mainWindow.webContents.send('GlobalShortcuts', 'MediaPreviousTrack')
  })

  mainWindow.hide()

  mainWindow.on('closed', function() {
    mainWindow = null
  })

})

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin')
    app.quit()
})
