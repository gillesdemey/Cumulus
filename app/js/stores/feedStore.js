'use strict';

var McFly             = require('../utils/mcfly');
var Actions           = require('../actions/actionCreators')

var AppStore          = require('../stores/appStore')
var PlaylistStore     = require('../stores/playlistStore')
var CurrentTrackStore = require('../stores/currentTrackStore')

var _                 = require('lodash')

var _loaded = false
var _last_fetch = 0

var _feed = []

var _next_href, _future_href

function _appendFeed(tracks) {
  _feed = _.uniq(_feed.concat(tracks), 'id')
}

function _setFeed(tracks) {
  _feed = tracks
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
  },

  getNextHref: function() {
    return _next_href
  },

  getFutureHref: function() {
    return _future_href
  },

  getLastFetch: function() {
    return _last_fetch
  }

}, function(payload) {

  switch (payload.actionType) {

    case 'LOADED_FEED':
      if (!AppStore.isVisibleTab('feed')) return

      _loaded = true
      _next_href = payload.next_href
      _future_href = payload.future_href
      _appendFeed(payload.tracks)

      if (PlaylistStore.getPlaylist().length === 0 || !CurrentTrackStore.getAudio().src)
        Actions.setPlaylist(_getTracks(payload.tracks))
      else
        Actions.addToPlaylist(_getTracks(payload.tracks))

      break

    case 'LOADED_FUTURE_FEED':
      _next_href = payload.next_href
      _future_href = payload.future_href
      _last_fetch = Date.now()

      _setFeed(payload.tracks)

      if (AppStore.isActiveTab('feed'))
        Actions.setPlaylist(_getTracks(payload.tracks))

      break

    case 'PLAY_TRACK':
      if (AppStore.isVisibleTab('feed'))
        AppStore.setActiveTab('feed')

      break

    case 'NEXT_TRACK':
      if (!AppStore.isActiveTab('feed')) return

      if (!PlaylistStore.peekNextTrack()) {
        Actions.fetchFeed({ next_href : _next_href })
          .then(function() {
            Actions.nextTrack()
          })
      }
      break

  }

  FeedStore.emitChange()

  return true
});

module.exports = FeedStore
