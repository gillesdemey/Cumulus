'use strict';

var React        = require('react');
var Router       = require('react-router');
var RouteHandler = Router.RouteHandler;

var Header       = require('../../views/partials/header');
var MediaPlayer  = require('./mediaPlayer');

var mediaDispatcher   = require('../dispatcher/mediaDispatcher');

var CumulusApp   = React.createClass({

  getInitialState: function () {
    return {
      'nowPlaying' : {},
      'paused'     : true,
    }
  },

  componentWillMount: function() {
    mediaDispatcher.register(function(msg) {

      if (msg.action === 'play') {
        this.setState({
          'nowPlaying' : msg.nowPlaying,
          'paused'     : false
        });
      }
      else if (msg.action === 'pause') {
        this.setState({ 'paused' : true });
      }

    }.bind(this))
  },

  componentWillUnmount: function() {

  },

  render: function() {

    return (
      <div className="cumulusapp">
        <Header />
        <RouteHandler />
        <MediaPlayer
          paused = { this.state.paused }
          cover  = { this.state.nowPlaying.cover }
          title  = { this.state.nowPlaying.title }
          stream = { this.state.nowPlaying.stream } />
      </div>
    );
  }

});

module.exports = CumulusApp;
