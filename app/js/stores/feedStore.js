'use strict';

var McFly         = require('../utils/mcfly');
var Actions       = require('../actions/actionCreators')
var PlaylistStore = require('../stores/playlistStore')
var _             = require('lodash')

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
      if (PlaylistStore.getPlaylist().length === 0)
        Actions.setPlaylist(payload.feed)
      break

    case 'PLAY_TRACK':
      if (!payload.track || !_.detect(_feed, { 'id' : payload.track.id }))
        return

      PlaylistStore.setPlaylist(_feed)
      PlaylistStore.setIndex(payload.track)
      break

  }

  FeedStore.emitChange()

  return true
});

module.exports = FeedStore
