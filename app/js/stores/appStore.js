'use strict';

var McFly = require('../utils/mcfly')
var Actions = require('../actions/actionCreators')

var visibleTab = ''  // the tab that is currently in view
var activeTab = ''   // the tab where we are currently Visible music from

var LastFetch = {}; // last time content was fetched

function _setActiveTab(tab) {
  activeTab = tab
}

function _setVisibleTab(tab) {
  visibleTab = tab
}

function _updateFeedViewLastFetch() {
  var ts = Date.now()
  LastFetch.FeedView = ts
  console.log('LOADED_FEED at %s', ts)
}

function _getFeedViewLastFetch() {
  return LastFetch.FeedView
}

function _updateLikesViewLastFetch() {
  var ts = Date.now()
  LastFetch.LikesView = ts
  console.log('LOADED_COLLECTION at %s', ts)
}

function _getLikesViewLastFetch() {
  return LastFetch.LikesView
}

var AppStore = McFly.createStore({

  getActiveTab: function() {
    return activeTab
  },

  getVisibleTab: function() {
    return visibleTab
  },

  isActiveTab: function(tab) {
    return tab === activeTab
  },

  isVisibleTab: function(tab) {
    return tab === visibleTab
  },

  setActiveTab: _setActiveTab,
  setVisibleTab: _setVisibleTab,

  getFeedViewLastFetch: _getFeedViewLastFetch,
  updateFeedViewLastFetch: _updateFeedViewLastFetch,

  getLikesViewLastFetch: _getLikesViewLastFetch,
  updateLikesViewLastFetch: _updateLikesViewLastFetch

}, function(payload) {

  switch (payload.actionType) {

    case 'ACTIVE_TAB':
      _setActiveTab(payload.tab)
      break

    case 'VISIBLE_TAB':
      _setVisibleTab(payload.tab)

      var lastFetch = 0

      if (payload.tab === 'feed') {
        var FeedStore = require('../stores/feedStore')
        lastFetch = FeedStore.getLastFetch()

        // every 5 minutes
        if (Date.now() - lastFetch >= 300000) {
          Actions.fetchFutureFeed()
        }

      }

      if (payload.tab === 'likes') {
        var LikesStore = require('../stores/likesStore')
        lastFetch = LikesStore.getLastFetch()

        // every 5 minutes
        if (Date.now() - lastFetch >= 300000) {
          Actions.fetchFutureLikes()
        }
      }

      break

    case 'LOADED_FEED':
      _updateFeedViewLastFetch()
      break

    case 'LOADED_COLLECTION':
      _updateLikesViewLastFetch()
      break

  }

  AppStore.emitChange()

  return true
});

module.exports = AppStore
