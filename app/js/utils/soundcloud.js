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
      'oauth_token' : self._token,
      'limit'       : 50,
    }
  }

  options = _.defaults(options, defaults)

  return rp(options)
}

SoundCloud.prototype._mapTracks = function(track) {
  if (track.stream_url) // append client_id for audio stream access
    track.stream_url += '?client_id=' + this._clientId

  if (track.artwork_url) // high-resolution artwork
    track.artwork_url = track.artwork_url.replace('-large', '-t500x500');

  if (track.user.avatar_url)
    track.user.avatar_url = track.user.avatar_url.replace('-large', '-t500x500');

  return track
}

SoundCloud.prototype.fetchVisual = function(trackId) {
  return rp({
    url  : 'https://visuals.soundcloud.com/visuals?urn=soundcloud:sounds:' + trackId,
    json : true,
    transform: function(body) {
      return body.visuals ? body.visuals[0].visual_url : null;
    }
  })
  .catch(function(ex) {
    console.error(ex)
  });
};

SoundCloud.prototype.fetchLikes = function() {
  var self = this
  return SoundCloud.prototype.makeRequest.call(self, 'me/favorites')
    .then()
    .map(SoundCloud.prototype._mapTracks.bind(self))
    .catch(function(ex) {
      console.error(ex)
    })
}

SoundCloud.prototype.fetchFeed = function() {
  var self = this
  return SoundCloud.prototype.makeRequest.call(self, 'me/activities')
    .then(function(resp) {
      return resp.collection
    })
    .map(function(item) {
      return item.origin
    })
    .map(SoundCloud.prototype._mapTracks.bind(self))
    .then(function(tracks) {
      // SoundCloud activities can return multiple of the same track
      return _.uniq(tracks, 'id')
    })
    .catch(function(ex) {
      console.error(ex)
    })
}

SoundCloud.prototype.fetchPlaylists = function() {
  var self = this
  return SoundCloud.prototype.makeRequest.call(self, 'me/playlists')
    .then()
    .map(SoundCloud.prototype._mapTracks.bind(self))
    .catch(function(ex) {
      console.error(ex)
    })
}

module.exports = new SoundCloud()