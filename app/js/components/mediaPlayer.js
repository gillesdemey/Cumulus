'use strict';

var React       = require('react');

var mediaDispatcher  = require('../dispatcher/mediaDispatcher');

var MediaPlayer = React.createClass({

  audio: function() {
    return React.findDOMNode(this.refs.audio);
  },

  getInitialState: function() {
    return {
      'paused' : true,
    };
  },

  componentDidMount: function() {

  },

  play: function() {
    if (!this.props.stream)
      return;

    this.audio().play();
    mediaDispatcher.dispatch({
      'state'  : 'playing',
      'stream' : this.props.stream
    });
  },

  pause: function() {
    if (!this.props.stream)
      return;

    this.audio().pause();
    mediaDispatcher.dispatch({
      'state'  : 'paused',
      'stream' : this.props.stream
    });
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.paused)
      this.pause();
    else if (!nextProps.paused && this.props.stream)
      this.play();

    this.setState({
      'paused' : nextProps.paused
    })
  },

  render: function() {

    return (
      <div className="cumulus__media-player">
        <img src={this.props.cover} alt={this.props.title} height="30" width="30" />
        { this.props.title } { this.state.paused ? '►' : '❚❚' }
        <audio controls autoPlay ref="audio" src={this.props.stream} preload="metadata">
        </audio>
      </div>
    );
  }

});

module.exports = MediaPlayer;
