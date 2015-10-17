'use strict';

var McFly            = require('../utils/mcfly')
var SoundCloud       = require('../utils/soundcloud')

var CurrenTrackStore = require('../stores/currentTrackStore')

var actions

window.require('ipc').on('GlobalShortcuts', function(accelerator) {
  switch (accelerator) {

    case 'MediaPlayPause':
      if (CurrenTrackStore.getAudio().paused)
        actions.playTrack()
      else
        actions.pauseTrack()
      break

    case 'MediaPreviousTrack':
      actions.previousTrack()
      break

    case 'MediaNextTrack':
      actions.nextTrack()
      break

  }

})

actions = McFly.createActions({

  /**
   * App
   */
  setVisibleTab: function(tab) {
    return {
      'actionType' : 'VISIBLE_TAB',
      'tab'        : tab
    }
  },

  setActiveTab: function(tab) {
    return {
      'actionType' : 'ACTIVE_TAB',
      'tab'        : tab
    }
  },

  /**
   * Tracks
   */
  playTrack: function(track) {
    return {
      'actionType' : 'PLAY_TRACK',
      'track'      : track
    }
  },

  pauseTrack: function() {
    return {
      'actionType' : 'PAUSE_TRACK'
    }
  },

  seekTrack: function(seconds) {
    if (isFinite(seconds))
      return {
        'actionType' : 'SEEK_TRACK',
        'time'       : seconds
      }
  },

  nextTrack: function() {
    return {
      'actionType' : 'NEXT_TRACK'
    }
  },

  previousTrack: function() {
    return {
      'actionType' : 'PREVIOUS_TRACK'
    }
  },

  likeTrack: function(track) {
    return SoundCloud.toggleLikeTrack(track)
      .then(function() {
        return {
          'actionType' : !track.user_favorite ? 'LIKE_TRACK' : 'UNLIKE_TRACK',
          'track'      : track
        }
      })
  },

  /**
   * Playlist
   */
  setPlaylist: function(tracks) {
    return {
      'actionType' : 'SET_PLAYLIST',
      'tracks'     : tracks
    }
  },

  addToPlaylist: function(tracks) {
    return {
      'actionType' : 'ADD_TO_PLAYLIST',
      'tracks'     : tracks
    }
  },

  /**
   * Collections
   */
  fetchLikes: function(options) {
    options = options || {}

    return SoundCloud.fetchLikes(options)
      .then(function(page) {
        var actionType = options.prepend
          ? 'LOADED_FUTURE_COLLECTION'
          : 'LOADED_COLLECTION'

         return {
          'actionType'  : actionType,
          'tracks'      : page.tracks,
          'next_href'   : page.next_href
        }
      })
      .catch(function(ex) {
        console.error(ex)
      })
  },

  fetchFutureLikes: function() {
    return actions.fetchLikes({ prepend : true })
  },

  fetchFeed: function(options) {
    options = options || {}

    return SoundCloud.fetchFeed(options)
      .then(function(page) {
        var actionType = options.prepend
          ? 'LOADED_FUTURE_FEED'
          : 'LOADED_FEED'

        return {
          'actionType'  : actionType,
          'tracks'      : page.tracks,
          'next_href'   : page.next_href,
          'future_href' : page.future_href
        }
      })
      .catch(function(ex) {
        console.error(ex)
      })
  },

  fetchFutureFeed: function() {
    return actions.fetchFeed({ prepend : true })
  },

  fetchPlaylists: function() {
    return SoundCloud.fetchPlaylists()
      .then(function(playlists) {
        return {
          'actionType' : 'LOADED_PLAYLISTS',
          'playlists'  : playlists
        }
      })
      .catch(function(ex) {
        console.error(ex)
      })
  },

})

module.exports = actions
