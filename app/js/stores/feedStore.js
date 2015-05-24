'use strict';

var McFly   = require('../utils/mcfly');
var Actions = require('../actions/actionCreators')

var _feed   = []

function _setFeed(tracks) {
  _feed = tracks
}

var FeedStore = McFly.createStore({

  getFeed: function() {
    return _feed
  },

}, function(payload) {

  switch (payload.actionType) {

    case 'LOADED_FEED':
      _setFeed(payload.feed)
      Actions.setPlaylist(payload.feed)
      break

  }

  FeedStore.emitChange()

  return true
});

module.exports = FeedStore
