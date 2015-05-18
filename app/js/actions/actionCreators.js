'use strict';

var McFly       = require('../utils/mcfly')
var SoundCloud  = require('../utils/soundcloud')

var actions = McFly.createActions({

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

})

module.exports = actions
