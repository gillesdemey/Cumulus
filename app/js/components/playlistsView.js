'use strict';

var React             = require('react')
var PlaylistListItem  = require('./PlaylistListItem')

var classNames        = require('classnames')

var Actions           = require('../actions/actionCreators')
var PlaylistsStore    = require('../stores/playlistsStore')
var CurrentTrackStore = require('../stores/currentTrackStore')

function getStateFromStores() {
  return {
    'playlists'    : PlaylistsStore.getPlaylists(),
    'loading'      : !PlaylistsStore.loaded(),
    'currentTrack' : CurrentTrackStore.getTrack(),
    'currentAudio' : CurrentTrackStore.getAudio(),
    'empty'        : PlaylistsStore.getPlaylists().length === 0 && PlaylistsStore.loaded()
  }
}

var PlaylistsView = React.createClass({

  getInitialState: function () {
    return getStateFromStores()
  },

  componentWillMount: function() {
    if (!PlaylistsStore.loaded())
      Actions.fetchPlaylists()
        .catch(function(err) {
          this.setState({ 'error' : err, 'loading' : false })
        }.bind(this))

    PlaylistsStore.addChangeListener(this._onChange)
    CurrentTrackStore.addChangeListener(this._onChange)
  },

  componentWillUnmount: function() {
    PlaylistsStore.removeChangeListener(this._onChange)
    CurrentTrackStore.removeChangeListener(this._onChange)
  },

  componentDidMount: function() {
    Actions.setVisibleTab('playlists')
  },

  _onChange: function() {
    this.setState(getStateFromStores())
  },

  render: function() {

    var classes = classNames({
      'content__view__playlists' : true,
      'loading'                  : this.state.loading,
      'error'                    : this.state.hasOwnProperty('error'),
      'empty'                    : this.state.empty,
    })

    return (
      <section className={classes}>
        {this.state.playlists.map(function(playlist) {
          return (
            <PlaylistListItem
              key          = {playlist.id}
              playlist     = {playlist}
              tracks       = {playlist.tracks}
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

module.exports = PlaylistsView