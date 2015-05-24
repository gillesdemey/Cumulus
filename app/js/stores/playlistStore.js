'use strict';

var _     = require('lodash')
var McFly = require('../utils/mcfly');

var _playlist = []
var _index    = 0

function _addToPlaylist(tracks) {
  if (Array.isArray(tracks))
    _playlist.concat(tracks)
  else
    _playlist.push(tracks)
}

function _setPlaylist(tracks) {
  _playlist = _.clone(tracks)
}

function _setIndex(index) {
  _index = index
}

function _getIndexById(track) {
  if (!track)
    return _index

  return _.findIndex(_playlist, { 'id' : track.id })
}

function _nextTrack() {
  if (_index === _playlist.length - 1)
    return

  _index++

  return _playlist[_index]
}

function _previousTrack() {
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

  setIndex: function(trackOrId) {
    if (isFinite(trackOrId))
      _setIndex(trackOrId)
    else
      _index = _getIndexById(trackOrId)
  },

  nextTrack: function() {
    return _nextTrack()
  },

  previousTrack: function() {
    return _previousTrack()
  },

}, function(payload) {

  switch (payload.actionType) {

    case 'ADD_TO_PLAYLIST':
      _addToPlaylist(payload.tracks)
      break

    case 'SET_PLAYLIST':
      _setPlaylist(payload.tracks)
      break

  }

  PlaylistStore.emitChange()

  return true
});

module.exports = PlaylistStore
