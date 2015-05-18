'use strict';

var McFly = require('../utils/mcfly');

var _track = {}          // Current track information
var _audio = new Audio() // Current audio element

function _setTrack(track) {
  _track = track

  if (!_audio.paused)
    _audio.pause()

  _audio = new Audio(track.stream_url)
}

function _pause() {
  _audio.pause()
}

function _play() {
  _audio.play()
}

var TrackStore = McFly.createStore({

  getTrack: function() {
    return _track
  },

  getAudio: function() {
    return _audio
  }

}, function(payload) {

  switch (payload.actionType) {

    case 'PLAY_TRACK':

      // We can call 'play' without a track, resume the current active track
      if (payload.track && _track.id !== payload.track.id) {
        _setTrack(payload.track)
      }

      _play()
      break

    case 'PAUSE_TRACK':
      _pause()
      break

  }

  TrackStore.emitChange()

  return true
});

TrackStore.setMaxListeners(0) // increase max listeners to infinity

module.exports = TrackStore
