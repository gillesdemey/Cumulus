'use strict';

var React      = require('react');
var classNames = require('classnames');

var mediaDispatcher = require('../dispatcher/mediaDispatcher');

var GridItem = React.createClass({

  getInitialState: function() {
    return { 'paused' : true };
  },

  handleClick: function() {
    if (this.state.paused)
      this.play();
    else
      this.pause();
  },

  componentDidMount: function() {
    mediaDispatcher.register(function(msg) {

      // message from self
      if (msg.nowPlaying && msg.nowPlaying.stream === this.props.stream) {
        this.setState({ 'paused' : msg.action === 'pause' })
      }

      // message from mediaPlayer
      if (msg.state && msg.stream === this.props.stream) {
        this.setState({ 'paused' : msg.state === 'paused' })
      }

      if (msg.state && msg.stream !== this.props.stream) {
        this.setState({ 'paused' : true })
      }

    }.bind(this));
  },

  play: function() {
    mediaDispatcher.dispatch({
      'action'     : 'play',
      'nowPlaying' : this.props
    })
  },

  pause: function() {
    mediaDispatcher.dispatch({ 'action' : 'pause' })
  },

  render: function() {

    var classes = classNames({
      'overlay__play-pause' : true,
      'paused'              : this.state.paused
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