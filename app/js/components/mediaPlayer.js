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
    this.state.audio.addEventListener('timeupdate', this.updateHandler)
  },

  componentWillUnmount: function() {
    CurrentTrackStore.removeChangeListener(this._onChange)
    this.state.audio.removeEventListener('timeupdate', this.updateHandler)
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

  nextTrack: function() {
    Actions.nextTrack()
  },

  previousTrack: function() {
    Actions.previousTrack()
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

    var cover = this.state.track.artwork_url || (this.state.track.user
      ? this.state.track.user.avatar_url
      : '')

    var playPause = this.state.audio.paused || this.state.audio.error
      ? '\uf198'
      : '\uf191'

    var currentTime = time.formatDuration(this.state.audio.currentTime)

    var duration = this.state.timeLeft
      ? '-' + (time.formatDuration((this.state.track.duration / 1000)
         - this.state.audio.currentTime))
      : time.formatDuration(this.state.track.duration / 1000)

    var coverStyle = {
      'backgroundImage' : 'url(' + cover + ')'
    }

    return (
      <div className={classes}>

        <div className="media-player__cover" style={coverStyle}>
          <div className="media-player__meta">
            <div className="meta__artist">
              <span>
                { this.state.track.user ? this.state.track.user.username : null }
              </span>
            </div>
            <div className="meta__title">
              <span>{ this.state.track.title }</span>
            </div>
          </div>
        </div>

        <div className="media-player__controls">

          <div className="controls__play-pause-skip">

            <div className="play-pause-skip__wrapper">
              <button className="controls__previous">
                <i className="fi" onClick={this.previousTrack}>{'\uf19c'}</i>
              </button>

              <button className="controls__play-pause" onClick={this.playOrPause}>
                <i className="fi">{playPause}</i>
              </button>

              <button className="controls__next">
                <i className="fi" onClick={this.nextTrack}>{'\uf17c'}</i>
              </button>
            </div>

          </div>

          <div className="controls__timeline">

            <div className="timeline__current">
              { currentTime }
            </div>

            <div className="timeline__seeker">
              <div className="seeker__wrapper" onClick={this.seek}>
                <progress
                  className="seeker__progress-bar"
                  value={ this.state.audio.currentTime }
                  max={ (this.state.track.duration / 1000) || 0 }>
                </progress>
              </div>
            </div>

            <div className="timeline__duration" onClick={this.toggleTimeLeft}>
              { duration }
            </div>

          </div>

          <div className="controls__volume">

          </div>

        </div>

      </div>
    );
  }

});

module.exports = MediaPlayer;
