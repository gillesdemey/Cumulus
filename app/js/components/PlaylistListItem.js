'use strict';

var React             = require('react')
var classNames        = require('classnames')

var ListItem          = require('./ListItem')

var PlaylistListItem = React.createClass({

  getInitialState: function() {
    return { }
  },

  componentDidMount: function() {
    if (this.props.active)
      this.focus()
  },

  focus: function() {
    this.getDOMNode().scrollIntoViewIfNeeded() // non-standard DOM method
    this.setState({ 'focused' : true })
  },

  render: function() {

    var cover = this.props.playlist.artwork_url || this.props.tracks[0].artwork_url

    var playPause = classNames({
      'overlay__play-pause' : true,
      'fi-play'             : this.props.paused || this.props.error,
      'fi-pause'            : !this.props.paused,
      'loading'             : this.props.loading
    })

    var listItemClasses = classNames({
      'list-item' : true,
      'playlist'  : true
    })

    var numTracks = this.props.tracks.length + ' track'
      + (this.props.tracks.length > 1 ? 's' : '')

    return (
      <div className={listItemClasses}>

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

        {this.props.tracks.map(function(track) {

          var me      = this.props.currentTrack.id === track.id

          var paused  = me ? this.props.currentAudio.paused  : true
          var loading = me ? this.props.currentAudio.loading : false
          var error   = me ? this.props.currentAudio.error : !track.streamable
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