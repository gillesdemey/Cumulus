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
  fetchLikes: function() {
    return SoundCloud.fetchLikes()
      .then(function(tracks) {
         return {
          'actionType' : 'LOADED_COLLECTION',
          'collection' : tracks
        }
      })
  },

  fetchFeed: function() {
    return SoundCloud.fetchFeed()
      .then(function(tracks) {
        return {
          'actionType' : 'LOADED_FEED',
          'feed'       : tracks
        }
      })
  },

  fetchPlaylists: function() {
    return SoundCloud.fetchPlaylists()
      .then(function(playlists) {
        return {
          'actionType' : 'LOADED_PLAYLISTS',
          'playlists'  : playlists
        }
      })
  },

})

module.exports = actions
