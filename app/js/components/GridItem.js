'use strict';

var React             = require('react')
var classNames        = require('classnames')
var Actions           = require('../actions/actionCreators')
var CurrentTrackStore = require('../stores/currentTrackStore')

var GridItem = React.createClass({

  getInitialState: function() {
    return {
      'track'  : this.props.track,
      'audio' : new window.Audio(this.props.track.stream_url)
    }
  },

  componentWillMount: function() {
    CurrentTrackStore.addChangeListener(this._onChange)
  },

  componentWillUnmount: function() {
    CurrentTrackStore.removeChangeListener(this._onChange)
  },

  _onChange: function() {
    var currentAudio = CurrentTrackStore.getCurrentAudio()

    // currentAudio is already updated, pause this local audio element
    if (currentAudio.src !== this.state.audio.src)
      this.state.audio.pause()

  },

  playOrPause: function() {
    if (this.state.audio.paused)
      this.play()
    else
      this.pause()
  },

  play: function() {
    Actions.playTrack(this.state.track, this.state.audio)
  },

  pause: function() {
    Actions.pauseTrack()
  },

  render: function() {

    var classes = classNames({
      'overlay__play-pause' : true,
      'paused'              : this.state.audio.paused
    })

    return (
      <div className="grid-item">
        <div className="item__cover">
          <img src={this.props.track.artwork_url} width="200" height="200" />
          <div className="cover__overlay">
            <a className={classes} onClick={this.playOrPause}></a>
          </div>
        </div>
        <span className="title">{this.props.track.title}</span>
        <span className="artist">{this.props.track.artist}</span>
      </div>
    )
  }

})

module.exports = GridItem