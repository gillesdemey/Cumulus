'use strict';

var React        = require('react');
var Router       = require('react-router');
var RouteHandler = Router.RouteHandler;

var Header       = require('../views/partials/header');
var MediaPlayer  = require('./media-player');

var dispatcher   = require('../js/centralDispatcher');

var CumulusApp   = React.createClass({

  getInitialState: function () {
    return {
      'nowPlaying' : {},
      'audio'      : {},
    }
  },

  componentWillMount: function() {
    dispatcher.register(function(msg) {

      if (msg['media.action'] === 'play') {
        this.setState({
          'audio'      : msg['media.audio'],
          'nowPlaying' : msg['media.nowPlaying']
        });
      }

    }.bind(this))
  },

  componentWillUnmount: function() {

  },

  render: function() {

    return (
      <div>
        <Header />
        <RouteHandler />
        <MediaPlayer
          cover={this.state.nowPlaying.cover}
          title={this.state.nowPlaying.title}
          audio={this.state.audio} />
      </div>
    );
  }

});

module.exports = CumulusApp;