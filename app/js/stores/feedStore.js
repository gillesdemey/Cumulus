'use strict';

var McFly             = require('../utils/mcfly');
var Actions           = require('../actions/actionCreators')

var PlaylistStore     = require('../stores/playlistStore')
var CurrentTrackStore = require('../stores/currentTrackStore')

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
      if (PlaylistStore.getPlaylist().length === 0 || !CurrentTrackStore.getAudio().src)
        Actions.setPlaylist(payload.feed)
      break

  }

  FeedStore.emitChange()

  return true
});

module.exports = FeedStore
