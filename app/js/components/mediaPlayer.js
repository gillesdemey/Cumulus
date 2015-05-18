'use strict';

var React             = require('react')
var Actions           = require('../actions/actionCreators')
var CurrentTrackStore = require('../stores/currentTrackStore')

function getStateFromStores() {
  return {
    'track' : CurrentTrackStore.getTrack(),
    'audio' : CurrentTrackStore.getAudio()
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

  playOrPause: function() {
    if (this.state.audio.paused)
      this.play()
    else
      this.pause()
  },

  play: function() {
    Actions.playTrack()
  },

  pause: function() {
    Actions.pauseTrack()
  },

  render: function() {

    if (!this.state.audio)
      return (<div className="cumulus__media-player"></div>)

    return (
      <div className="cumulus__media-player">
        <img src={this.state.track.artwork_url} alt={this.state.track.title} height="30" width="30" />
        <div className="media-player__controls">
          <a className="controls__play-pause" onClick={this.playOrPause}>
            { this.state.track.title } { this.state.audio.paused ? '►' : '❚❚' }
          </a>
        </div>

      </div>
    );
  }

});

module.exports = MediaPlayer;
