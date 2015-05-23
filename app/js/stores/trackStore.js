'use strict';

var McFly   = require('../utils/mcfly');
var Actions = require('../actions/actionCreators')

var _collection   = []

function _setCollection(tracks) {
  _collection = tracks
}

var TrackStore = McFly.createStore({

  getCollection: function() {
    return _collection
  },

}, function(payload) {

  switch (payload.actionType) {

    case 'LOADED_COLLECTION':
      _setCollection(payload.collection)
      Actions.setPlaylist(payload.collection)
      break

  }

  TrackStore.emitChange()

  return true
});

module.exports = TrackStore
