'use strict';

var McFly = require('../utils/mcfly');

var _collection   = []
var _currentTrack = {}

function _setCollection(tracks) {
  _collection = tracks
}

function _setCurrentTrack(track) {
  _currentTrack = track
}

var TrackStore = McFly.createStore({

  getCollection: function() {
    return _collection
  },

  getCurrentTrack: function() {
    return _currentTrack
  }

}, function(payload) {

  switch (payload.actionType) {

    case 'LOADED_COLLECTION':
      _setCollection(payload.collection)
      break;

    case 'PLAY_TRACK':
      _setCurrentTrack(payload.track)
      break;

  }

  TrackStore.emitChange()
  return true
});

module.exports = TrackStore
