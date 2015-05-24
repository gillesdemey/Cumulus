'use strict';

var McFly   = require('../utils/mcfly');
var Actions = require('../actions/actionCreators')

var _playlists   = []

function _setPlaylists(tracks) {
  _playlists = tracks
}

var PlaylistsStore = McFly.createStore({

  getPlaylists: function() {
    return _playlists
  },

}, function(payload) {

  switch (payload.actionType) {

    case 'LOADED_PLAYLISTS':
      _setPlaylists(payload.playlists)
      // TODO: map playlists to list of tracks
      Actions.setPlaylist(payload.playlists)
      break

  }

  PlaylistsStore.emitChange()

  return true
});

module.exports = PlaylistsStore
