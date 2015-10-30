'use strict';

var React             = require('react')
var Actions           = require('../actions/actionCreators')
var CurrentTrackStore = require('../stores/currentTrackStore')

var time              = require('../utils/time')
var classNames        = require('classnames')
var _                 = require('lodash')

var remote            = window.require('remote');
var Menu              = remote.require('menu');
var MenuItem          = remote.require('menu-item');
var pjson             = remote.require('./package.json');

function getStateFromStores() {
  return {
    'track'      : CurrentTrackStore.getTrack(),
    'audio'      : CurrentTrackStore.getAudio(),
  }
}

var githubUrl = 'http://github.com/gillesdemey/Cumulus';

var MediaPlayer = React.createClass({

  menu: function() {
    var menu = new Menu();

    menu.append(new MenuItem({ label : 'Cumulus v' + pjson.version, enabled : false }));
    menu.append(new MenuItem({ label : 'Report a bug...', click : this.report }));
    menu.append(new MenuItem({ type  : 'separator' }));
    menu.append(new MenuItem({ label : 'About', click : this.about }));
    menu.append(new MenuItem({ type  : 'separator' }));
    menu.append(new MenuItem({ label : 'Logout', click : this.logout }));
    menu.append(new MenuItem({ label : 'Quit', click : this.quit }));

    return menu;
  },

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
    if (!this.state.audio.src) return

    Actions.nextTrack()
  },

  previousTrack: function() {
    if (!this.state.audio.src) return

    Actions.previousTrack()
  },

  like: function() {
    if (!this.state.track.id) return

    Actions.likeTrack(this.state.track)
  },

  seek: function(event) {
    if (!this.state.audio.src) return

    var pct = (event.pageX - event.currentTarget.offsetLeft) /
      event.currentTarget.getBoundingClientRect().width

    var time = pct * (this.state.track.duration / 1000)
    Actions.seekTrack(time)
  },

  toggleTimeLeft: function() {
    this.setState({ 'timeLeft' : !this.state.timeLeft })
  },

  settings: function() {
    this.menu().popup(remote.getCurrentWindow());
  },

  openExternal: function(url) {
    remote.require('shell').openExternal(url)
  },

  about: function() {
    this.openExternal(githubUrl);
  },

  report: function() {
    this.openExternal(githubUrl + '/issues');
  },

  openPermalink: function() {
    this.openExternal(this.state.track.permalink_url)
  },

  openPermalinkUser: function() {
    this.openExternal(this.state.track.user.permalink_url)
  },

  logout: function() {
    window.location.href = 'cumulus://logout'
  },

  quit: function() {
    remote.require('app').quit()
  },

  render: function() {

    var classes = classNames({
      'cumulus__media-player' : true
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

    var coverClasses = classNames({
      'media-player__cover' : true,
      'hidden'              : !this.state.audio.src
    })

    var favoriteStyle = classNames({
      'fi'     : true,
      'active' : !!this.state.track.user_favorite
    })

    return (
      <div className={classes}>

        <div className={coverClasses} style={coverStyle}>
          <div className="media-player__meta">
            <div className="meta__artist" onClick={this.openPermalinkUser}>
              <span>
                { this.state.track.user ? this.state.track.user.username : null }
              </span>
            </div>
            <div className="meta__title" onClick={this.openPermalink}>
              <span>{ this.state.track.title }</span>
            </div>
          </div>
        </div>

        <div className="media-player__controls">

          <div className="controls__play-pause-skip">

            <div className="play-pause-skip__wrapper">
              <button className="controls__previous" disabled={!this.state.audio.src}>
                <i className="fi" onClick={this.previousTrack}>{'\uf19c'}</i>
              </button>

              <button className="controls__play-pause" onClick={this.playOrPause}>
                <i className="fi">{playPause}</i>
              </button>

              <button className="controls__next" disabled={!this.state.audio.src}>
                <i className="fi" onClick={this.nextTrack}>{'\uf17c'}</i>
              </button>
            </div>

            <div className="controls__actions">
              <button className="meta__favorite" onClick={this.like} disabled={!this.state.audio.src}>
                <i className={favoriteStyle}>{'\uf159'}</i>
              </button>
              <button className="meta__settings" onClick={this.settings}>
                <i className="fi">{'\uf214'}</i>
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
