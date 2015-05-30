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
    'loading'      : PlaylistsStore.getPlaylists().length === 0,
    'currentTrack' : CurrentTrackStore.getTrack(),
    'currentAudio' : CurrentTrackStore.getAudio(),
  }
}

var PlaylistsView = React.createClass({

  getInitialState: function () {
    return getStateFromStores()
  },

  componentWillMount: function() {
    if (PlaylistsStore.getPlaylists().length === 0)
      Actions.fetchPlaylists()

    PlaylistsStore.addChangeListener(this._onChange)
    CurrentTrackStore.addChangeListener(this._onChange)
  },

  componentWillUnmount: function() {
    PlaylistsStore.removeChangeListener(this._onChange)
    CurrentTrackStore.removeChangeListener(this._onChange)
  },

  _onChange: function() {
    this.setState(getStateFromStores())
  },

  render: function() {

    var classes = classNames({
      'content__view__playlists' : true,
      'loading'                  : this.state.loading
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