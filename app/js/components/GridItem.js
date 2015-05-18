'use strict';

var React             = require('react')
var classNames        = require('classnames')
var Actions           = require('../actions/actionCreators')
var CurrentTrackStore = require('../stores/currentTrackStore')

var GridItem = React.createClass({

  getInitialState: function() {
    return { 'paused' : true }
  },

  getStateFromStores : function() {
    var currentTrack = CurrentTrackStore.getTrack()
    var currentAudio = CurrentTrackStore.getAudio()

    var paused = currentTrack.id === this.props.track.id
      ? currentAudio.paused
      : true

    return { 'paused' : paused }
  },

  componentWillMount: function() {
    CurrentTrackStore.addChangeListener(this._onChange)

    this.setState(this.getStateFromStores())
  },

  componentWillUnmount: function() {
    CurrentTrackStore.removeChangeListener(this._onChange)
  },

  _onChange: function() {
    var currentTrack = CurrentTrackStore.getTrack()

    if (currentTrack.id === this.props.track.id)
      this.setState({ 'paused' : !this.state.paused })
    else
      this.setState({ 'paused' : true })
  },

  playOrPause: function() {
    if (this.state.paused)
      this.play()
    else
      this.pause()
  },

  play: function() {
    Actions.playTrack(this.props.track)
  },

  pause: function() {
    Actions.pauseTrack()
  },

  render: function() {

    var cover = this.props.track.artwork_url || this.props.track.user.avatar_url

    var classes = classNames({
      'overlay__play-pause' : true,
      'paused'              : this.state.paused
    })

    return (
      <div className="grid-item">
        <div className="item__cover">
          <img src={cover} width="200" height="200" />
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