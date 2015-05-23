'use strict';

var _             = require('lodash')
var McFly         = require('../utils/mcfly')
var playlistStore = require('./playlistStore')

var TrackStore

var _track = {}          // Current track information
var _audio = new Audio() // Current audio element

function _setTrack(track) {
  _track = track

  _audio.src = track.stream_url
  _audio.load() // load the new stream source
}

function _setLoading() {
  _audio.loading = true
  TrackStore.emitChange()
}

function _pause() {
  _audio.pause()
}

function _play(track) {
  if (track && track.id !== _track.id)
    _setTrack(track)

  _audio.play()
}

function _seek(seconds) {
  _audio.currentTime = seconds

  if (_audio.paused)
    _play()
}

function _nextTrack() {
  var nextTrack = playlistStore.nextTrack()

  if (!nextTrack)
    return

  _play(nextTrack)
  TrackStore.emitChange()
}

function _previousTrack() {
  var previousTrack = playlistStore.previousTrack()

  if (!previousTrack)
    return

  _play(previousTrack)
  TrackStore.emitChange()
}

(function addListeners() {

  _audio.addEventListener('loadstart', _setLoading)
  _audio.addEventListener('waiting',   _setLoading)

  _audio.addEventListener('playing', function() {
    _audio.loading = false
    TrackStore.emitChange()
  })

  _audio.addEventListener('error', function() {
    TrackStore.emitChange()
    _nextTrack()
  })

  _audio.addEventListener('ended', _nextTrack)

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

    case 'NEXT_TRACK':
      _nextTrack()
      break

    case 'PREVIOUS_TRACK':
      _previousTrack()
      break

  }

  TrackStore.emitChange()

  return true
});

TrackStore.setMaxListeners(0) // increase max listeners to infinity

module.exports = TrackStore
