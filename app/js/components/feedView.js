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
    'loading_page' : false, // when loading an additional page
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
      Actions.fetchFeedPage()
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

  // $0.scrollHeight - $0.scrollTop === $0.getBoundingClientRect().height
  _scrollListener: function() {
    var section = this.refs.section.getDOMNode()
    var atBottom = section.scrollHeight - section.scrollTop === section.getBoundingClientRect().height

    if (atBottom)
      this._onScrollEnd()
  },

  _onScrollEnd: function() {
    var self = this
    self.setState({ 'loading_page' : true })
    Actions.fetchFeedPage()
      .then(function() {
        self.setState({ 'loading_page' : false })
      })
      .catch(function(err) {
        self.setState({ 'error' : err, 'loading_page' : false })
      })
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
    var page_loading = classNames({
      page_loader : true,
      loading     : this.state.loading_page
    })

    return (
      <section className={classes} onScroll={this._scrollListener} ref="section">
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
        <div className={page_loading}></div>
      </section>
    );
  }

});

module.exports = FeedView