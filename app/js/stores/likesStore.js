'use strict';

var McFly   = require('../utils/mcfly');
var Actions = require('../actions/actionCreators')

var _collection   = []

function _setCollection(tracks) {
  _collection = tracks
}

var LikesStore = McFly.createStore({

  getLikes: function() {
    return _collection
  },

}, function(payload) {

  switch (payload.actionType) {

    case 'LOADED_COLLECTION':
      _setCollection(payload.collection)
      Actions.setPlaylist(payload.collection)
      break

  }

  LikesStore.emitChange()

  return true
});

module.exports = LikesStore
