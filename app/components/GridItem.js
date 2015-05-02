'use strict';

var React      = require('react');
var classNames = require('classnames');

var centralDispatcher = require('../js/centralDispatcher');

var GridItem = React.createClass({

  getInitialState: function() {

    var audio     = new window.Audio(this.props.stream);
    audio.preload = 'metadata';

    return { 'audio' : audio, 'playing' : false };
  },

  handleClick: function() {
    if (!this.state.playing)
      this.play();
    else
      this.pause();

    this.setState({ 'playing' : !this.state.playing })
  },

  play: function() {
    centralDispatcher.dispatch({
      'media.action'     : 'play',
      'media.nowPlaying' : this.props,
      'media.audio'      : this.state.audio,
    })
  },

  pause: function() {
    centralDispatcher.dispatch({
      'media.action' : 'pause'
    })
  },

  render: function() {

    var classes = classNames({
      'overlay__play-pause' : true,
      'playing'             : this.state.playing
    });

    return (
      <div className="grid-item">
        <div className="item__cover">
          <img src={this.props.cover} width="200" height="200" />
          <div className="cover__overlay">
            <a className={classes} onClick={this.handleClick}></a>
          </div>
        </div>
        <span className="title">{this.props.title}</span>
        <span className="artist">{this.props.artist}</span>
      </div>
    );
  }

});

module.exports = GridItem;