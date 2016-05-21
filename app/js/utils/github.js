'use strict';

var remote            = window.require('electron').remote; // hack for browserify
var pjson             = remote.require('./package.json');
var rp                = window.require('request-promise')
var _                 = require('lodash')
var semver            = require('semver')

var GitHub = function() {
  this._repo       = 'http://github.com/gillesdemey/Cumulus'
  this._endpoint   = 'https://api.github.com/repos/gillesdemey/cumulus'
}

GitHub.prototype.getRepoUrl = function() {
  return this._repo
}

GitHub.prototype.checkForUpdates = function() {
  return this.getLatestRelease().then(function(response) {
    var tag = semver.clean(response.tag_name)

    if (semver.lt(pjson.version, tag)) {
      return Promise.reject('A new version of Cumulus is available.')
    } else {
      return Promise.resolve('Cumulus is currently up-to-date.')
    }
  }, function(error) {
    return Promise.reject('Cumulus was not able to check version information.')
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

  return rp(options)
}

module.exports = new GitHub()
