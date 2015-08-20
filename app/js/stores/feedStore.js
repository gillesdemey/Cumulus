'use strict';

var McFly             = require('../utils/mcfly');
var Actions           = require('../actions/actionCreators')

var PlaylistStore     = require('../stores/playlistStore')
var CurrentTrackStore = require('../stores/currentTrackStore')

var _                 = require('lodash')

var _loaded = false
var _feed   = []

function _appendFeed(tracks) {
  _feed = _.uniq(_feed.concat(tracks), 'id')
}

// Reduces a feed to a flat list of tracks
function _getTracks(feed) {
  return _.reduce(feed, function(results, trackOrPlaylist) {
    if (trackOrPlaylist.kind !== 'playlist')
      results.push(trackOrPlaylist)
    else if (trackOrPlaylist.kind === 'playlist')
      results = results.concat(trackOrPlaylist.tracks)
    return results
  }, [])
}

var FeedStore = McFly.createStore({

  getFeed: function() {
    return _feed
  },

  getTracks: function() {
    return _getTracks(_feed)
  },

  loaded: function() {
    return _loaded
  }

}, function(payload) {

  switch (payload.actionType) {

    case 'LOADED_FEED':
      _loaded = true
      _appendFeed(payload.feed)

      if (PlaylistStore.getPlaylist().length === 0 || !CurrentTrackStore.getAudio().src)
        Actions.setPlaylist(_getTracks(payload.feed))

      break

  }

  FeedStore.emitChange()

  return true
});

module.exports = FeedStore
