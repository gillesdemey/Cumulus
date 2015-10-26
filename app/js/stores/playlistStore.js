'use strict';

var _          = require('lodash')
var McFly      = require('../utils/mcfly')

var _playlist = []
var _index    = 0

function _addToPlaylist(tracks) {
  if (Array.isArray(tracks))
    _playlist = _playlist.concat(tracks)
  else
    _playlist.push(tracks)
}

function _setPlaylist(tracks) {
  _playlist = tracks
}

function _setIndex(index) {
  _index = index
}

function _getIndexById(track) {
  if (!track)
    return _index

  return _.findIndex(_playlist, { 'id' : track.id })
}

function _getNextTrack() {
  if (_index === _playlist.length - 1)
    return

  _index++

  return _playlist[_index]
}

function _peekNextTrack() {
  return _playlist[_index + 1]
}

function _getPreviousTrack() {
  if (_index === 0)
    return

  _index--

  return _playlist[_index]
}

function _clear() {
  _index = 0
  _playlist = []
}

var PlaylistStore = McFly.createStore({

  getPlaylist: function() {
    return _playlist
  },

  setPlaylist: function(tracks) {
    _playlist = tracks
  },

  addToPlaylist: function(tracks) {
    _addToPlaylist(tracks)
  },

  clearPlaylist: function() {
    _clear()
  },

  setIndex: function(trackOrId) {
    if (isFinite(trackOrId))
      _setIndex(trackOrId)
    else
      _setIndex(_getIndexById(trackOrId))
  },

  getIndex: function() {
    return _index
  },

  getNextTrack: function() {
    return _getNextTrack()
  },

  getPreviousTrack: function() {
    return _getPreviousTrack()
  },

  peekNextTrack: function() {
    return _peekNextTrack()
  }

}, function(payload) {

  switch (payload.actionType) {

    case 'ADD_TO_PLAYLIST':
      _addToPlaylist(payload.tracks)
      break

    case 'SET_PLAYLIST':
      _setPlaylist(payload.tracks)
      var currentTrackStore = require('./currentTrackStore')

      // calculate index
      var currentTrack = currentTrackStore.getTrack()
      var newIndex = !_.isEmpty(currentTrack)
        ? _getIndexById(currentTrack)
        : 0

      if (newIndex !== -1)
        _setIndex(newIndex)
      else
        _clear() // track was removed from collection

      break

    case 'PLAY_TRACK':
      if (payload.track)
        PlaylistStore.setIndex(payload.track)
      break
  }

  PlaylistStore.emitChange()

  return true
});

module.exports = PlaylistStore
