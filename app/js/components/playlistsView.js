'use strict';

var React          = require('react')
var ListItem       = require('./ListItem')

var classNames     = require('classnames')

var Actions        = require('../actions/actionCreators')
var PlaylistsStore = require('../stores/playlistsStore')

function getStateFromStores() {
  return {
    'playlists' : PlaylistsStore.getPlaylists(),
    'loading'   : PlaylistsStore.getPlaylists().length === 0
  }
}

var PlaylistsView = React.createClass({

  getInitialState: function () {
    return getStateFromStores()
  },

  componentWillMount: function() {
    PlaylistsStore.addChangeListener(this._onChange)

    if (PlaylistsStore.getPlaylists().length === 0)
      Actions.fetchPlaylists()
  },

  componentWillUnmount: function() {
    PlaylistsStore.removeChangeListener(this._onChange)
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
      <div className={classes}>
        {this.state.playlists.map(function(track) {
          return (
            <ListItem
              key   = {track.id}
              track = {track}
            >
            </ListItem>
          )
        })}
      </div>
    );
  }

});

module.exports = PlaylistsView