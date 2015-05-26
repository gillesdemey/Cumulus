'use strict';

var React             = require('react')
var ListItem          = require('./ListItem')

var classNames        = require('classnames')

var Actions           = require('../actions/actionCreators')
var LikesStore        = require('../stores/likesStore')
var CurrentTrackStore = require('../stores/currentTrackStore')

function getStateFromStores() {
  return {
    'tracks'       : LikesStore.getLikes(),
    'loading'      : LikesStore.getLikes().length === 0,
    'currentTrack' : CurrentTrackStore.getTrack(),
    'currentAudio' : CurrentTrackStore.getAudio()
  }
}

var LikesView = React.createClass({

  getInitialState: function () {
    return getStateFromStores()
  },

  componentWillMount: function() {
    if (LikesStore.getLikes().length === 0)
      Actions.fetchLikes()

    LikesStore.addChangeListener(this._onChange)
    CurrentTrackStore.addChangeListener(this._onChange)
  },

  componentWillUnmount: function() {
    LikesStore.removeChangeListener(this._onChange)
    CurrentTrackStore.removeChangeListener(this._onChange)
  },

  _onChange: function() {
    this.setState(getStateFromStores())
  },

  render: function() {

    var classes = classNames({
      'content__view__likes' : true,
      'loading'              : this.state.loading
    })

    return (
      <section className={classes}>
        {this.state.tracks.map(function(track) {

          var active  = this.state.currentTrack.id === track.id
          var paused  = active ? this.state.currentAudio.paused  : true
          var loading = active ? this.state.currentAudio.loading : false
          var error   = active ? this.state.currentAudio.error   : false

          return (
            <ListItem
              key     = { track.id }
              track   = { track }
              active  = { active }
              paused  = { paused }
              loading = { loading }
              error   = { error }
            >
            </ListItem>
          )
        }, this)}
      </section>
    );
  }

});

module.exports = LikesView