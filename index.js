'use strict';

var app           = require('app');
var BrowserWindow = require('browser-window');

var url           = require('url');
var querystring   = require('querystring');

var config        = require('./lib/config');

// require('crash-reporter').start();

var mainWindow  = null;
var loginWindow = null;

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin')
    app.quit();
});

app.on('ready', function() {

  function doLogin() {
    loginWindow = new BrowserWindow({ width: 500, height: 500, center: true, type: 'splash' });
    loginWindow.loadUrl('https://soundcloud.com/connect?client_id=f17c1d67b83c86194fad2b1948061c9e&response_type=token&scope=non-expiring&display=next&redirect_uri=cumullus://oauth/callback');
  }

  function initialize() {

    if (loginWindow)
      loginWindow.close();

    mainWindow.show();
  }

  // register Cumulus protocol
  var protocol = require('protocol');
  protocol.registerProtocol('cumullus', function(req) {

    // parse access token
    var hash  = url.parse(req.url).hash.substr(1);
    var token = querystring.parse(hash).access_token;

    config.set('access_token', token, function(err) {
      if (err)
        throw err;
      else
        initialize();
    });

  });

  // check if we already have an access_token
  config.get('access_token', function(err, value) {
    if (err)
      throw err;

    if (typeof value !== 'undefined')
      initialize();
    else
      doLogin();
  });


  mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.hide();
  mainWindow.loadUrl('file://' + __dirname + '/app/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

});
