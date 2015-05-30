'use strict';

var McFly         = require('../utils/mcfly')
var Actions       = require('../actions/actionCreators')
var PlaylistStore = require('../stores/playlistStore')
var _             = require('lodash')

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
  }

}, function(payload) {

  switch (payload.actionType) {

    case 'LOADED_PLAYLISTS':
      _setPlaylists(payload.playlists)
      if (PlaylistStore.getPlaylist().length === 0)
        Actions.setPlaylist(_tracks)
      break

    case 'PLAY_TRACK':
      if (!payload.track || !_.detect(_tracks, { 'id' : payload.track.id }))
        return

      PlaylistStore.setPlaylist(_tracks)
      PlaylistStore.setIndex(payload.track)
      break

  }

  PlaylistsStore.emitChange()

  return true
});

module.exports = PlaylistsStore
