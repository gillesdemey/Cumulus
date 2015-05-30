'use strict';

var React             = require('react')
var classNames        = require('classnames')

var ListItem          = require('./ListItem')
var Actions           = require('../actions/actionCreators')

var _                 = require('lodash')

var playlistStore     = require('../stores/playlistStore')

var PlaylistListItem = React.createClass({

  getInitialState: function() {
    return { }
  },

  componentDidMount: function() {
    if (this.props.active)
      this.focus()
  },

  play: function(track) {
    Actions.setPlaylist(this.props.tracks)
    Actions.playTrack(track)
  },

  pause: function() {
    Actions.pauseTrack()
  },

  playOrPause: function() {
    if (!_.isEqual(this.props.tracks, playlistStore.getPlaylist()))
      this.play(this.props.tracks[0])
    else if (this.props.currentAudio.paused)
      this.play()
    else
      this.pause()
  },

  render: function() {

    var cover = this.props.playlist.artwork_url || this.props.tracks[0].artwork_url

    var audio  = this.props.currentAudio
    var mine   = _.isEqual(this.props.tracks, playlistStore.getPlaylist())
              && _.detect(this.props.tracks, { 'id' : this.props.currentTrack.id })

    var playPause = classNames({
      'overlay__play-pause' : true,
      'fi-play'             : mine ? (audio.paused || audio.error) : true,
      'fi-pause'            : mine ? !audio.paused : false,
      'loading'             : mine ? audio.loading : false
    })

    var listItemClasses = classNames({
      'list-item' : true,
      'playlist'  : true,
      'active'    : mine && !audio.error
    })

    var numTracks = this.props.tracks.length + ' track'
      + (this.props.tracks.length > 1 ? 's' : '')

    return (
      <div className={listItemClasses}>

        <div className="playlist__header" onClick={this.playOrPause}>
          <div className="item__cover" style={{'backgroundImage' : 'url(' + cover + ')'}}>
            <div className="cover__overlay">
              <button className={playPause}></button>
            </div>
          </div>

          <div className="item__meta">
            <div className="item__artist">{this.props.playlist.user.username}</div>
            <div className="item__title">{this.props.playlist.title}</div>
            <span className="item__duration">{ numTracks }</span>
          </div>
        </div>

        {this.props.tracks.map(function(track) {

          var me      = this.props.currentTrack.id === track.id

          var paused  = me ? audio.paused  : true
          var loading = me ? audio.loading : false
          var error   = me ? audio.error   : !track.streamable
          var active  = me && !error

          return (
            <ListItem
              type    = 'small'
              key     = { track.id }
              track   = { track }
              active  = { active }
              paused  = { paused }
              loading = { loading }
              error   = { error }
            >
            </ListItem>
          )
        }, this)}
      </div>
    )
  }

})

module.exports = PlaylistListItem