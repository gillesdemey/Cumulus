'use strict';

var React       = require('react')
var TrackStore  = require('../stores/trackStore')

function getStateFromStores() {
  return {
    'track' : TrackStore.getCurrentTrack()
  }
}

var MediaPlayer = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentWillMount: function() {
    TrackStore.addChangeListener(this._onChange)
  },

  componentWillUnmount: function() {
    TrackStore.addChangeListener(this._onChange)
  },

  _onChange: function() {
    this.setState(getStateFromStores())
  },

  play: function() { },

  pause: function() { },

  render: function() {
    return (
      <div className="cumulus__media-player">
        <img src={this.state.track.artwork_url} alt={this.state.track.title} height="30" width="30" />
        { this.state.track.title } { this.state.paused ? '►' : '❚❚' }
        <audio controls autoPlay src={this.state.track.stream_url} preload="metadata"></audio>
      </div>
    );
  }

});

module.exports = MediaPlayer;
