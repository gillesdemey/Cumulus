'use strict';

var McFly       = require('../utils/mcfly')
var SoundCloud  = require('../utils/soundcloud')

var actions = McFly.createActions({

  playTrack: function(track) {
    return {
      'actionType' : 'PLAY_TRACK',
      'track'      : track
    };
  },

  pauseTrack: function(track) {
    return {
      'actionType' : 'PAUSE_TRACK',
      'track'      : track
    };
  },

  likeTrack: function(track) {
    return {
      'actionType' : 'LIKE_TRACK',
      'track'      : track
    };
  },

  // TODO: maybe separate this into a new actions file for API calls
  fetchCollection: function() {
    return SoundCloud.fetchCollection()
      .then(function(items) {
         return {
          'actionType' : 'LOADED_COLLECTION',
          'collection' : items
        }
      })
  }

});

module.exports = actions;
