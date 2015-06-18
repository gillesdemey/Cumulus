'use strict';

var React             = require('react')
var ListItem          = require('./ListItem')
var PlaylistListItem  = require('./PlaylistListItem')

var classNames        = require('classnames')

var Actions           = require('../actions/actionCreators')
var FeedStore         = require('../stores/feedStore')
var CurrentTrackStore = require('../stores/currentTrackStore')

function getStateFromStores() {
  return {
    'tracks'       : FeedStore.getFeed(),
    'loading'      : !FeedStore.loaded(),
    'currentTrack' : CurrentTrackStore.getTrack(),
    'currentAudio' : CurrentTrackStore.getAudio(),
    'empty'        : FeedStore.getFeed().length === 0 && FeedStore.loaded()
  }
}

var FeedView = React.createClass({

  getInitialState: function () {
    return getStateFromStores()
  },

  componentWillMount: function() {
    if (!FeedStore.loaded())
      Actions.fetchFeed()
        .catch(function(err) {
          this.setState({ 'error' : err, 'loading' : false })
        }.bind(this))

    FeedStore.addChangeListener(this._onChange)
    CurrentTrackStore.addChangeListener(this._onChange)
  },

  componentWillUnmount: function() {
    FeedStore.removeChangeListener(this._onChange)
    CurrentTrackStore.removeChangeListener(this._onChange)
  },

  _onChange: function() {
    this.setState(getStateFromStores())
  },

  render: function() {

    var classes = classNames({
      'content__view__feed' : true,
      'loading'             : this.state.loading,
      'error'               : this.state.hasOwnProperty('error'),
      'empty'               : this.state.empty,
    })

    return (
      <section className={classes}>
        {this.state.tracks.map(function(track) {

          var me      = this.state.currentTrack.id === track.id

          var paused  = me ? this.state.currentAudio.paused  : true
          var loading = me ? this.state.currentAudio.loading : false
          var error   = me ? this.state.currentAudio.error : !track.streamable
          var active  = me && !error

          if (track.kind === 'track')
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

          else if (track.kind === 'playlist')
            return (
              <PlaylistListItem
                key          = {track.id}
                playlist     = {track}
                tracks       = {track.tracks}
                currentTrack = {this.state.currentTrack}
                currentAudio = {this.state.currentAudio}
              >
              </PlaylistListItem>
            )

          }, this)}
      </section>
    );
  }

});

module.exports = FeedView