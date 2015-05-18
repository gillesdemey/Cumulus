'use strict';

var React             = require('react')
var Actions           = require('../actions/actionCreators')
var CurrentTrackStore = require('../stores/currentTrackStore')

function getStateFromStores() {
  return {
    'track' : CurrentTrackStore.getCurrentTrack(),
    'audio' : CurrentTrackStore.getCurrentAudio()
  }
}

var MediaPlayer = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentWillMount: function() {
    CurrentTrackStore.addChangeListener(this._onChange)
  },

  componentWillUnmount: function() {
    CurrentTrackStore.removeChangeListener(this._onChange)
  },

  _onChange: function() {
    this.setState(getStateFromStores())
  },

  play: function() {
    Actions.playTrack(this.state.track)
  },

  pause: function() {
    Actions.pauseTrack(this.state.track)
  },

  render: function() {

    if (!this.state.audio)
      return (<div className="cumulus__media-player"></div>)

    return (
      <div className="cumulus__media-player">
        <img src={this.state.track.artwork_url} alt={this.state.track.title} height="30" width="30" />
        { this.state.track.title } { this.state.audio.paused ? '►' : '❚❚' }
      </div>
    );
  }

});

module.exports = MediaPlayer;
