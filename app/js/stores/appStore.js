'use strict'

var McFly = require('../utils/mcfly')
var Actions = require('../actions/actionCreators')

var visibleTab = ''  // the tab that is currently in view
var activeTab = ''   // the tab where we are currently Visible music from

var LastFetch = {} // last time content was fetched
var cacheDuration = 120e+3

function _setActiveTab(tab) {
  activeTab = tab
}

function _setVisibleTab(tab) {
  visibleTab = tab
}

function _updateFeedViewLastFetch() {
  var ts = Date.now()
  LastFetch.FeedView = ts
}

function _getFeedViewLastFetch() {
  return LastFetch.FeedView
}

function _updateLikesViewLastFetch() {
  var ts = Date.now()
  LastFetch.LikesView = ts
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

    case 'WINDOW_FOCUS':
      loadNewer()
      break

    case 'VISIBLE_TAB':
      _setVisibleTab(payload.tab)
      loadNewer(payload.tab)
      break

    case 'LOADED_FEED':
      _updateFeedViewLastFetch()
      break

    case 'LOADED_COLLECTION':
      _updateLikesViewLastFetch()
      break

  }

  function loadNewer(tab) {

    switch (payload.tab) {
      case 'feed':
        loadNewerFeed()
        break

      case 'likes':
        loadNewerLikes()
        break

      default:
        loadNewerFeed()
        loadNewerLikes()
        break
    }
  }

  function loadNewerFeed() {
    var FeedStore = require('../stores/feedStore')
    var lastFetch = FeedStore.getLastFetch()
    if (Date.now() - lastFetch >= cacheDuration) Actions.fetchFutureFeed()
  }

  function loadNewerLikes() {
    var LikesStore = require('../stores/likesStore')
    var lastFetch = LikesStore.getLastFetch()
    if (Date.now() - lastFetch >= cacheDuration) Actions.fetchFutureLikes()
  }

  AppStore.emitChange()

  return true
})

module.exports = AppStore
