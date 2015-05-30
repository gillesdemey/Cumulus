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
  else if (typeof shortUrl === 'string' && shortUrl.indexOf('://') === -1)
    options.url = this._endpoint + shortUrl
  else if (typeof shortUrl === 'string' && shortUrl.indexOf('://') !== -1)
    options.url = shortUrl

  var defaults = {
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

  if (track.artwork_url)
    track.artwork_url = _artworkFormat(track.artwork_url, 'crop');

  if (track.user.avatar_url)
    track.user.avatar_url = _artworkFormat(track.user.avatar_url, 'crop');

  return track
}

SoundCloud.prototype.fetchVisual = function(trackId) {
  return rp({
    url  : 'https://visuals.soundcloud.com/visuals?urn=soundcloud:sounds:' + trackId,
    json : true,
    transform: function(body) {
      return body.visuals ? body.visuals[0].visual_url : null
    }
  })
  .catch(function(ex) {
    console.error(ex)
  })
}

SoundCloud.prototype.fetchWaveform = function(url) {
  return this.makeRequest(url)
    .then(function(resp) {
      return resp.samples
    })
}

SoundCloud.prototype.fetchLikes = function() {
  return this.makeRequest('me/favorites')
    .then()
    .bind(this)
    .map(this._mapTracks)
    .catch(function(ex) {
      console.error(ex)
    })
}

SoundCloud.prototype.fetchFeed = function() {
  return this.makeRequest('me/activities')
    .then(function(resp) {
      return resp.collection
    })
    .then(function(items) {
      // not supporting playlists just yet
      return _.reject(items, { 'type' : 'playlist' })
    })
    .map(function(item) {
      return item.origin
    })
    .bind(this)
    .map(this._mapTracks)
    .then(function(tracks) {
      // SoundCloud activities can return multiple of the same track
      tracks = _.uniq(tracks, 'id')
      return tracks
    })
    .catch(function(ex) {
      console.error(ex)
    })
}

SoundCloud.prototype.fetchPlaylists = function() {
  return this.makeRequest('me/playlists')
    .then()
    .bind(this)
    .map(this._mapTracks)
    .catch(function(ex) {
      console.error(ex)
    })
}

/**
 * Grab different resolution of artwork
 */
function _artworkFormat(url, size) {
  size = size || 't300x300';
  return url.replace('-large', '-' + size);
}

module.exports = new SoundCloud();