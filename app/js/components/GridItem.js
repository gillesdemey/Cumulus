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
      return this.setState({ 'paused' : true })

    this.setState({
      'error'   : audio.error,
      'paused'  : audio.paused,
      'loading' : audio.loading,
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
      'fi-play'             : this.state.paused,
      'fi-pause'            : !this.state.paused,
      'error'               : this.state.error,
      'loading'             : this.state.loading
    })

    var coverStyle = {
      backgroundImage : 'url(' + cover + ')'
    }

    return (
      <div className="grid-item">

        <div className="item__cover" style={coverStyle}>
          <div className="cover__overlay">
            <button className={playPause} onClick={this.playOrPause}></button>
          </div>
          <span className="item__title">{this.props.track.title}</span>
          <span className="item__artist">{this.props.track.user.username}</span>
        </div>

        <div className="item__footer">
          <div className="item__playback_count">
            <i className="fi fi-play"></i> {this.props.track.playback_count}
          </div>
          <div className="item__favoritings_count">
            <i className="fi fi-heart"></i> {this.props.track.favoritings_count}
          </div>
        </div>

      </div>
    )
  }

})

module.exports = GridItem