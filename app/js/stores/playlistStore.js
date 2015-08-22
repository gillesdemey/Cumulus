'use strict';

var _     = require('lodash')
var McFly = require('../utils/mcfly');

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

function _getPreviousTrack() {
  if (_index === 0)
    return

  _index--

  return _playlist[_index]
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

}, function(payload) {

  switch (payload.actionType) {

    case 'ADD_TO_PLAYLIST':
      _addToPlaylist(payload.tracks)
      break

    case 'SET_PLAYLIST':
      _setPlaylist(payload.tracks)
      _setIndex(0)
      break

    case 'PLAY_TRACK':
      if (payload.track)
        PlaylistStore.setIndex(payload.track)

  }

  PlaylistStore.emitChange()

  return true
});

module.exports = PlaylistStore
