'use strict';

var React             = require('react')
var Actions           = require('../actions/actionCreators')
var CurrentTrackStore = require('../stores/currentTrackStore')

var classNames        = require('classnames')

function getStateFromStores() {
  return {
    'track'      : CurrentTrackStore.getTrack(),
    'audio'      : CurrentTrackStore.getAudio(),
    'audioState' : CurrentTrackStore.getState()
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
    if (this.state.audioState.paused)
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

    var playPause = this.state.audioState.paused ? 'fi fi-play' : 'fi fi-pause'

    var classes = classNames({
      'cumulus__media-player' : true,
      'hidden'                : !this.state.audio.src
    })

    return (
      <div className={classes}>

        <div className="media-player__controls">

          <div className="controls__play-pause-skip">

            <button className="controls__previous">
              <i className="fi fi-previous"></i>
            </button>

            <button className="controls__play-pause" onClick={this.playOrPause}>
              <i className={playPause}></i>
            </button>

            <button className="controls__next">
              <i className="fi fi-next"></i>
            </button>

          </div>

          <div className="controls__timeline">

          </div>

          <div className="controls__volume">

          </div>

        </div>

        <div className="media-player__cover">
          <img src={this.state.track.artwork_url} alt={this.state.track.title} height="30" width="30" />
        </div>

        <div className="media-player__meta">
          { this.state.track.title }
        </div>

      </div>
    );
  }

});

module.exports = MediaPlayer;
