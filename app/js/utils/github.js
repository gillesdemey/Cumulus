'use strict';

var remote            = window.require('remote');
var pjson             = remote.require('./package.json');
var rp                = window.require('request-promise')
var _                 = require('lodash')

var GitHub = function(options) {
  this._repo       = 'http://github.com/gillesdemey/Cumulus'
  this._endpoint   = 'https://api.github.com/repos/gillesdemey/cumulus'
}

GitHub.prototype.getRepoUrl = function() {
  return this._repo;
}

GitHub.prototype.checkForUpdates = function() {
  return this.getLatestRelease().then(function(response) {
    var tag = response.tag_name.replace(/v/g, '')

    if(pjson.version == tag) {
      return Promise.resolve('Cumulus is currently up-to-date.')
    } else {
      return Promise.reject('A new version of Cumulus is available.')
    }
  }, function(error) {
    return Promise.reject('Cumulus was not able to check version information.');
  })
}

GitHub.prototype.getLatestRelease = function() {
  var options = {
    uri: this._endpoint + '/releases/latest',
    json: true,
    headers: {
      'User-Agent': 'gillesdemey/Cumulus'
    },
  }

  return rp(options);
}

module.exports = new GitHub();
