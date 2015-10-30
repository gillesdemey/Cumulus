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
    'next_href'    : LikesStore.getNextHref(),
    'loading'      : !LikesStore.loaded(),
    'loading_page' : false,
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

  componentDidMount: function() {
    Actions.setVisibleTab('likes')
  },

  _scrollListener: function() {
    var section = this.refs.section.getDOMNode()
    var atBottom = section.scrollHeight - section.scrollTop === section.getBoundingClientRect().height

    if (atBottom)
      this._onScrollEnd()
  },

  _setLoadingPage: function(loading) {
    this.setState({ 'loading_page' : loading })
  },

  _onScrollEnd: function() {
    var self = this

    if (!self.state.next_href)
      return console.warn('no next page available')

    self._setLoadingPage(true)
    Actions.fetchLikes({ next_href : self.state.next_href })
      .then(function() {
        self._setLoadingPage(false)
      })
      .catch(function(err) {
        self.setState({ 'error' : err })
        self._setLoadingPage(false)
      })
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
        <div className={page_loading}></div>
      </section>
    );
  }

});

module.exports = LikesView