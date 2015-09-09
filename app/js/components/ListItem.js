'use strict';

var React             = require('react')
var State             = require('react-router').State
var classNames        = require('classnames')
var Actions           = require('../actions/actionCreators')
var time              = require('../utils/time')
var AppStore          = require('../stores/appStore')

var ListItem = React.createClass({

  mixins: [ State ],

  getInitialState: function() {
    return { }
  },

  shouldComponentUpdate: function(nextProps) {
    if (this.props.error)
      return false

    if (!nextProps.active && !this.props.active)
      return false
    else
      return true
  },

  componentDidMount: function() {
    if (this.isActive(AppStore.getActiveTab()) && this.props.active)
      this.focus()
  },

  playOrPause: function() {

    if (this.props.error)
      return

    if (this.props.paused)
      this.play()
    else
      this.pause()
  },

  play: function() {
    this.setPlaylist()
    Actions.playTrack(this.props.track)
  },

  pause: function() {
    Actions.pauseTrack()
  },

  setPlaylist: function() {
    if (this.isActive('likes'))
      Actions.setPlaylist(require('../stores/likesStore').getLikes())

    else if (this.isActive('playlists'))
      Actions.setPlaylist(require('../stores/playlistsStore').getTracks())

    else if (this.isActive('feed'))
      Actions.setPlaylist(require('../stores/feedStore').getTracks())
  },

  focus: function() {
    this.getDOMNode().scrollIntoViewIfNeeded() // non-standard DOM method
    this.setState({ 'focused' : true })
  },

  render: function() {

    var cover = this.props.track.artwork_url || this.props.track.user.avatar_url

    var playPause = classNames({
      'overlay__play-pause' : true,
      'fi-play'             : this.props.paused || this.props.error,
      'fi-pause'            : !this.props.paused,
      'loading'             : this.props.loading && this.props.active
    })

    var listItemClasses = {
      'list-item' : true,
      'active'    : this.props.active,
      'error'     : this.props.error,
    }
    listItemClasses[this.props.type] = this.props.hasOwnProperty('type')

    return (
      <div className={classNames(listItemClasses)} onClick={this.playOrPause}>

        <div className="item__cover" style={{'backgroundImage' : 'url(' + cover + ')'}}>
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