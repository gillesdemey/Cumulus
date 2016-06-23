'use strict';

var _             = require('lodash')
var McFly         = require('../utils/mcfly')
var Dispatcher    = McFly.dispatcher
var playlistStore = require('./playlistStore')

var TrackStore

var _track = {}          // Current track information
var _audio = new Audio() // Current audio element

_audio.volume = +localStorage.getItem('lastVolume') || 1

function _showNotification(track) {
  if (document.visibilityState !== 'hidden') return
  new window.Notification(track.user.username, {
    body   : track.title,
    icon   : track.artwork_url,
    silent : true
  })
}

function _setTrack(track) {
  _track = track

  _audio.src = track.stream_url
  _audio.load() // load the new stream source
  _showNotification(track)
}

function _setLoading(bool) {
  _audio.loading = bool
  TrackStore.emitChange()
}

function _pause() {
  _audio.pause()
}

function _play(track) {
  if (track && track.id !== _track.id)
    _setTrack(track)

  _audio.play()
  TrackStore.emitChange()
}

function _seek(seconds) {
  _audio.currentTime = seconds

  if (_audio.paused)
    _play()
}

function _nextTrack() {
  var nextTrack = playlistStore.getNextTrack()

  if (nextTrack)
  _play(nextTrack)
}

function _previousTrack() {
  var previousTrack = playlistStore.getPreviousTrack()

  if (previousTrack)
  _play(previousTrack)
}

function _setVolume (volume) {
  _audio.volume = volume
}

function _toggleLikeTrack(track) {
  _track.user_favorite = !track.user_favorite
}

(function addListeners() {

  _audio.addEventListener('loadstart', function() {
    _setLoading(true)
  })
  _audio.addEventListener('waiting',   function() {
    _setLoading(true)
  })

  _audio.addEventListener('playing', function() {
    _setLoading(false)
  })

  _audio.addEventListener('error', function() {
    _setLoading(false)
    _nextTrack()
  })

  _audio.addEventListener('ended', function() {
    TrackStore.emitChange()
    _nextTrack()
  })

})()

TrackStore = McFly.createStore({

  getTrack: function() {
    return _track
  },

  getAudio: function() {
    return _audio
  },

}, function(payload) {

  switch (payload.actionType) {

    case 'PLAY_TRACK':

      if (!payload.track && _.isEmpty(_audio.src))
        _play(playlistStore.getPlaylist()[0])
      else
        _play(payload.track)

      break

    case 'PAUSE_TRACK':
      _pause()
      break

    case 'SEEK_TRACK':
      _seek(payload.time)
      break

    case 'SET_VOLUME':
      _setVolume(payload.volume)
      break

    case 'NEXT_TRACK':
      // wait for other stores to update first
      Dispatcher.waitFor([
        require('./feedStore').dispatcherID,
        require('./likesStore').dispatcherID,
        require('./playlistsStore').dispatcherID
      ])
      _nextTrack()
      break

    case 'PREVIOUS_TRACK':
      _previousTrack()
      break

    case 'LIKE_TRACK':
    case 'UNLIKE_TRACK':
      _toggleLikeTrack(payload.track)
      break
  }

  TrackStore.emitChange()

  return true
});

module.exports = TrackStore
