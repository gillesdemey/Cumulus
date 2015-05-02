'use strict';

var React       = require('react');

var dispatcher  = require('../js/centralDispatcher');

var MediaPlayer = React.createClass({

  getInitialState: function() {
    return {
      'audio'   : this.props.audio,
      'playing' : !this.props.audio.paused
    };
  },

  componentDidMount: function() {
    dispatcher.register(function(msg) {

      if (!msg['media.action'])
        return;

      switch (msg['media.action']) {
        case 'play':
          this.play();
          break;
        case 'pause':
          this.pause();
          break;
      }

    }.bind(this));
  },

  play: function() {
    if (!this.state.audio.src)
      return;

    this.setState({ 'playing' : true });
    this.state.audio.play();
  },

  pause: function() {
    if (!this.state.audio.src)
      return;

    this.setState({ 'playing' : false });
    this.state.audio.pause();
  },

  componentWillReceiveProps: function(nextProps) {

    // pause previous audio source first
    if (nextProps.audio.src !== this.props.audio.src)
      this.pause();

    // update currect audio state
    this.setState({
      'audio' : nextProps.audio
    }, function() {
      this.state.audio.play();
    })
  },

  render: function() {

    return (
      <div className="cumulus__media-player">
        <img src={this.props.cover} alt={this.props.title} height="30" width="30" />
        { this.props.title } { this.state.playing ? '►' : '❚❚' }
      </div>
    );
  }

});

module.exports = MediaPlayer;