'use strict';

var React             = require('react')
var classNames        = require('classnames')
var Actions           = require('../actions/actionCreators')

var CurrentTrackStore = require('../stores/currentTrackStore')

var ListItem = React.createClass({

  getInitialState: function() {
    return { 'paused' : true }
  },

  getStateFromStores : function() {
    var track = CurrentTrackStore.getTrack()
    var audio = CurrentTrackStore.getAudio()

    var paused = track.id === this.props.track.id
      ? audio.paused
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
    var track = CurrentTrackStore.getTrack()
    var audio = CurrentTrackStore.getAudio()

    if (track.id !== this.props.track.id)
      return this.setState({ 'paused' : true, 'active' : false })

    this.setState({
      'error'   : audio.error,
      'paused'  : audio.paused,
      'loading' : audio.loading,
      'active'  : true
    })

  },

  playOrPause: function() {

    if (this.state.error)
      return

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

    var playPause = classNames({
      'overlay__play-pause' : true,
      'fi-play'             : this.state.paused || this.state.error,
      'fi-pause'            : !this.state.paused,
      'loading'             : this.state.loading
    })

    var listItemClasses = classNames({
      'list-item' : true,
      'active'    : this.state.active
    })

    return (
      <div className={listItemClasses} onClick={this.playOrPause}>

        <div className="item__cover">
          <img src={cover} alt={this.props.track.title} width="64" height="64" />
          <div className="cover__overlay">
            <button className={playPause}></button>
          </div>
        </div>

        <div className="item__meta">
          <div className="item__artist">{this.props.track.user.username}</div>
          <div className="item__title">{this.props.track.title}</div>
        </div>

      </div>
    )
  }

})

module.exports = ListItem