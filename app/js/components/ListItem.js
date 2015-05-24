'use strict';

var React             = require('react')
var classNames        = require('classnames')
var Actions           = require('../actions/actionCreators')
var time              = require('../utils/time')

var CurrentTrackStore = require('../stores/currentTrackStore')

var ListItem = React.createClass({

  getInitialState: function() {
    return { 'paused' : true, 'active' : false, 'loading' : false }
  },

  getStateFromStores : function() {
    var track = CurrentTrackStore.getTrack()
    var audio = CurrentTrackStore.getAudio()

    var active = track.id === this.props.track.id
    var paused = active ? audio.paused : true

    return { 'paused' : paused, 'active' : active }
  },

  componentWillMount: function() {
    CurrentTrackStore.addChangeListener(this._onChange)
    this.setState(this.getStateFromStores())
  },

  componentWillUnmount: function() {
    CurrentTrackStore.removeChangeListener(this._onChange)
  },

  componentDidMount: function() {
    if (this.state.active)
      this.focus()
  },

  _onChange: function() {
    var audio = CurrentTrackStore.getAudio()

    if (audio.src !== this.props.track.stream_url)
      return this.setState(this.getInitialState())

    this.setState({
      'error'   : audio.error,
      'paused'  : audio.paused,
      'loading' : audio.loading,
      'active'  : !audio.error ? true : false,
    })

    if (!this.state.focused)
      this.focus()
  },

  playOrPause: function() {

    if (this.state.error)
      return

    this.focus()

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

  focus: function() {
    this.refs.item.getDOMNode().scrollIntoViewIfNeeded() // non-standard DOM method
    this.setState({ 'focused' : true })
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
      <div className={listItemClasses} onClick={this.playOrPause} ref="item">

        <div className="item__cover">
          <img src={cover} alt={this.props.track.title} width="64" height="64" />
          <div className="cover__overlay">
            <button className={playPause}></button>
          </div>
        </div>

        <div className="item__meta">
          <div className="item__artist">{this.props.track.user.username}</div>
          <div className="item__title">{this.props.track.title}</div>
          <span className="item__duration">
            { time.formatDuration(this.props.track.duration / 1000) }
          </span>
        </div>

      </div>
    )
  }

})

module.exports = ListItem