'use strict';

var McFly = require('../utils/mcfly');

var _currentTrack = {}                  // Current track information
var _currentAudio = new window.Audio()  // Current audio element

function _setCurrentTrack(track, audio) {
  _currentTrack = track
  _currentAudio = audio
}

function _pauseCurrentTrack() {
  _currentAudio.pause()
}

function _startCurrentTrack() {
  _currentAudio.play()
}

var TrackStore = McFly.createStore({

  getCurrentTrack: function() {
    return _currentTrack
  },

  getCurrentAudio: function() {
    return _currentAudio
  }

}, function(payload) {

  switch (payload.actionType) {

    case 'PLAY_TRACK':

      if (_currentTrack.id !== payload.track.id) {
        _setCurrentTrack(payload.track, payload.audio)
      }

      _startCurrentTrack()
      break

    case 'PAUSE_TRACK':
      _pauseCurrentTrack()
      break

  }

  TrackStore.emitChange()
  return true
});

module.exports = TrackStore
