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
    'loading'      : !LikesStore.loaded(),
    'currentTrack' : CurrentTrackStore.getTrack(),
    'currentAudio' : CurrentTrackStore.getAudio(),
    'empty'        : LikesStore.getLikes().length === 0 && LikesStore.loaded(),
  }
}

var LikesView = React.createClass({

  getInitialState: function () {
    return getStateFromStores()
  },

  componentWillMount: function() {
    if (!LikesStore.loaded())
      Actions.fetchLikes()
        .catch(function(err) {
          this.setState({ 'error' : err, 'loading' : false })
        }.bind(this))

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
      'loading'              : this.state.loading,
      'error'                : this.state.hasOwnProperty('error'),
      'empty'                : this.state.empty,
    })

    return (
      <section className={classes}>
        {this.state.tracks.map(function(track) {

          var me      = this.state.currentTrack.id === track.id

          var paused  = me ? this.state.currentAudio.paused  : true
          var loading = me ? this.state.currentAudio.loading : false
          var error   = me ? this.state.currentAudio.error   : !track.streamable
          var active  = me && !error

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