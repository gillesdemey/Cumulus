'use strict';

var McFly = require('../utils/mcfly');

var TrackStore

var _track = {}          // Current track information
var _audio = new Audio() // Current audio element

var _audioState = {      // Current audio state, audio object is unreliable(!)
  'paused'  : true,
  'loading' : false,
  'error'   : false
};

function _setAudioState(obj) {
  for (var key in obj)
    _audioState[key] = obj[key]
}

function _setTrack(track) {
  _track = track
  _setAudioState({ 'error' : false, 'loading' : false })

  _audio.src = track.stream_url
  _audio.load() // load the new stream source
}

function _setLoading() {
  _setAudioState({ 'loading' : true })
  TrackStore.emitChange()
}

function _pause() {
  _audio.pause()
}

function _play() {
  _audio.play()
}

(function addListeners() {

  _audio.addEventListener('loadstart', _setLoading)
  _audio.addEventListener('waiting',   _setLoading)

  _audio.addEventListener('error', function(e) {
    _setAudioState({ 'paused' : true, 'error' : true, 'loading' : false })
    TrackStore.emitChange()
  })

  _audio.addEventListener('playing', function() {
    _setAudioState({ 'paused' : false, 'loading' : false })
    TrackStore.emitChange()
  })

  _audio.addEventListener('pause', function() {
    _setAudioState({ 'paused' : true })
    TrackStore.emitChange()
  })

})()

TrackStore = McFly.createStore({

  getTrack: function() {
    return _track
  },

  getAudio: function() {
    return _audio
  },

  getState: function() {
    return _audioState
  }

}, function(payload) {

  switch (payload.actionType) {

    case 'PLAY_TRACK':

      // If we call 'play' without a track, resume the current active track
      if (payload.track && payload.track.id !== _track.id) {
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
