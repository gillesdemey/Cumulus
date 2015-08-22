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

SoundCloud.prototype._mapTrack = function(track) {
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
    .map(this._mapTrack)
}

SoundCloud.prototype.fetchFeedPage = function(next_href) {
  var self = this
  next_href = next_href || 'me/activities'

  return self.makeRequest(next_href)
    .then(function(resp) {
      next_href = resp.next_href
      return resp.collection
    })
    .map(function(item) {
      return item.origin
    })
    .map(function(item) {
      if (item.kind === 'playlist')
        return self.expandPlaylist(item)
      else if (item.kind === 'track')
        return self._mapTrack(item)
    })
    .then(function(tracks) {
      // SoundCloud activities can return multiple of the same track
      tracks = _.uniq(tracks, 'id')
      return {
        tracks    : tracks,
        next_href : next_href
      }
    })
}

SoundCloud.prototype.fetchPlaylists = function() {
  return this.makeRequest('me/playlists')
    .then()
    .bind(this)
    .map(this._mapTrack)
    .map(function(playlist) {
      playlist.tracks = _.map(playlist.tracks, function(track) {
        return this._mapTrack(track)
      }.bind(this))
      return playlist
    })
}

SoundCloud.prototype.expandPlaylist = function(playlist) {
  if (!playlist.hasOwnProperty('tracks_uri') || playlist.kind !== 'playlist')
    return

  return this.makeRequest(playlist.tracks_uri)
    .then(function(tracks) {
      playlist.tracks = tracks
      return tracks
    })
    .bind(this)
    .map(this._mapTrack)
    .then(function() {
      return playlist
    })
}

SoundCloud.prototype.toggleLikeTrack = function(track) {
  var method = track.user_favorite ? 'DELETE' : 'PUT';
  return this.makeRequest('me/favorites/' + track.id, { method : method });
}

/**
 * Grab different resolution of artwork
 */
function _artworkFormat(url, size) {
  size = size || 't300x300';
  return url.replace('-large', '-' + size);
}

module.exports = new SoundCloud();