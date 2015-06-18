'use strict';

var McFly             = require('../utils/mcfly')
var Actions           = require('../actions/actionCreators')

var PlaylistStore     = require('../stores/playlistStore')
var CurrentTrackStore = require('../stores/currentTrackStore')

var _                 = require('lodash')

var _loaded      = false
var _playlists   = [] // list of al playlists
var _tracks      = [] // list of tracks from all playlists

function _setPlaylists(playlists) {
  _playlists = playlists
  _tracks    = _.reduce(playlists, function(result, playlist) {
    result = result.concat(playlist.tracks)
    return result
  }, [])
}

var PlaylistsStore = McFly.createStore({

  getPlaylists: function() {
    return _playlists
  },

  getTracks: function() {
    return _tracks
  },

  loaded: function() {
    return _loaded
  }

}, function(payload) {

  switch (payload.actionType) {

    case 'LOADED_PLAYLISTS':
      _loaded = true
      _setPlaylists(payload.playlists)
      if (PlaylistStore.getPlaylist().length === 0 || !CurrentTrackStore.getAudio().src)
        Actions.setPlaylist(_tracks)
      break

  }

  PlaylistsStore.emitChange()

  return true
});

module.exports = PlaylistsStore
