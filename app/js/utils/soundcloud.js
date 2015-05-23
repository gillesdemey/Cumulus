'use strict';

var rp      = window.require('request-promise')
var _       = require('lodash')

var SoundCloud = function(options) {
  this._endpoint   = 'http://api.soundcloud.com/'
  this._token      = undefined
  this._clientId   = undefined
}

SoundCloud.prototype.initialize = function(options) {

  if (!options.client_id)
    throw new Error('Could not initialize SoundCloud. Missing `client_id`.')

  if (!options.access_token)
    throw new Error('Could not initialize SoundCloud. Missing `access_token`.')

  this._endpoint  = this._endpoint || options.endpoint
  this._token     = options.access_token
  this._clientId  = options.client_id
}

SoundCloud.prototype.makeRequest = function(shortUrl, options) {
  var self = this
  options  = options || {}

  if (typeof shortUrl === 'object')
    options = shortUrl
  else if (typeof shortUrl === 'string')
    options.url = shortUrl

  var defaults = {
    'baseUrl'       : self._endpoint,
    'method'        : 'GET',
    'json'          : true,
    'qs'            : {
      'client_id'   : self._clientId,
      'oauth_token' : self._token
    }
  }

  options = _.assign(defaults, options)

  return rp(options)
    .promise()
    .map(function(item) {

      if (item.stream_url) // append client_id for audio stream access
        item.stream_url += '?client_id=' + self._clientId

      if (item.artwork_url) // high-resolution artwork
        item.artwork_url = item.artwork_url.replace('-large', '-t200x200');

      if (item.user.avatar_url)
        item.user.avatar_url = item.user.avatar_url.replace('-large', '-t200x200');

      return item
    })
    .catch(function(ex) {
      console.error(ex)
    })

}

SoundCloud.prototype.fetchVisual = function(trackId) {
  return rp('https://visuals.soundcloud.com/visuals?urn=soundcloud:sounds:' + trackId, {
    json: true,
    transform: function(body, response) {
      return body.visuals ? body.visuals[0].visual_url : null;
    }
  })
    .promise()
    .catch(function(ex) {
      console.error(ex)
    });
};

SoundCloud.prototype.fetchCollection = function() {
  return SoundCloud.prototype.makeRequest.call(this, 'me/favorites')
}

module.exports = new SoundCloud()