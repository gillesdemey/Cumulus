'use strict';

var React             = require('react')
var Actions           = require('../actions/actionCreators')
var CurrentTrackStore = require('../stores/currentTrackStore')

var time              = require('../utils/time')
var classNames        = require('classnames')
var _                 = require('lodash')

function getStateFromStores() {
  return {
    'track'      : CurrentTrackStore.getTrack(),
    'audio'      : CurrentTrackStore.getAudio(),
  }
}

var MediaPlayer = React.createClass({

  getInitialState: function() {
    return _.merge({
      'timeLeft' : false // "time-left" mode
    }, getStateFromStores());
  },

  updateHandler: function() {
    this.setState({ 'audio.currentTime' : this.state.audio.currentTime })
  },

  componentWillMount: function() {
    CurrentTrackStore.addChangeListener(this._onChange)

    // only mediaPlayer needs to know about currentTime updates
    this.state.audio.addEventListener('timeupdate', this.updateHandler)
  },

  componentWillUnmount: function() {
    CurrentTrackStore.removeChangeListener(this._onChange)
    this.state.audio.removeEventListener('timeupdate', this.updateHandler)
  },

  componentDidMount: function() {
    // TODO: don't set this as state
    this.setState({
      'seekerWidth' : this.refs.seeker.getDOMNode().getBoundingClientRect().width
    })
  },

  _onChange: function() {
    this.setState(getStateFromStores())
  },

  playOrPause: function() {

    if (this.state.audio.error)
      return

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

  seek: function(event) {
    var pct = (event.pageX - event.currentTarget.offsetLeft) /
      event.currentTarget.getBoundingClientRect().width

    var time = pct * (this.state.track.duration / 1000)
    Actions.seekTrack(time)
  },

  toggleTimeLeft: function() {
    this.state.timeLeft = !this.state.timeLeft
  },

  render: function() {

    var classes = classNames({
      'cumulus__media-player' : true,
      'hidden'                : !this.state.audio.src
    })

    var playPause = this.state.audio.paused ? 'fi fi-play' : 'fi fi-pause'

    var progress = Math.round
      ((this.state.audio.currentTime / (this.state.track.duration / 1000))
        *  this.state.seekerWidth)
      || 0

    var currentTime = time.formatDuration(this.state.audio.currentTime)

    var duration = this.state.timeLeft
      ? '-' + (time.formatDuration((this.state.track.duration / 1000) - this.state.audio.currentTime))
      : time.formatDuration(this.state.track.duration / 1000)

    var handle = {
      'transform' : 'translateX(' + progress + 'px)'
    }

    var progressBar = {
      'width' : progress
    }

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
            <div className="timeline__current">
              { currentTime }
            </div>
            <div className="timeline__seeker">
              <div className="seeker__wrapper" ref="seeker" onClick={this.seek}>
                <div className="seeker__progress-bar-background"></div>
                <div className="seeker__progress-bar" style={progressBar}></div>
                <div className="seeker__progress-handle" style={handle}></div>
              </div>
            </div>
            <div className="timeline__duration" onClick={this.toggleTimeLeft}>
              { duration }
            </div>
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
