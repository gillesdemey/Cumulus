'use strict';

var React      = require('react');
var classNames = require('classnames');
var Actions    = require('../actions/actionCreators')

var GridItem = React.createClass({

  // The audio object is passed to the MediaPlayer component and kept in sync
  getInitialState: function() {
    return { 'paused' : true }
  },

  playOrPause: function() {
    if (this.state.paused)
      this.play()
    else
      this.pause()
  },

  play: function() {
    Actions.playTrack(this.props.track)
  },

  pause: function() {
    Actions.pauseTrack(this.props.track)
  },

  render: function() {

    var classes = classNames({
      'overlay__play-pause' : true,
      'paused'              : this.state.paused
    });

    return (
      <div className="grid-item">
        <div className="item__cover">
          <img src={this.props.track.artwork_url} width="200" height="200" />
          <div className="cover__overlay">
            <a className={classes} onClick={this.playOrPause}></a>
          </div>
        </div>
        <span className="title">{this.props.track.title}</span>
        <span className="artist">{this.props.track.artist}</span>
      </div>
    );
  }

})

module.exports = GridItem;