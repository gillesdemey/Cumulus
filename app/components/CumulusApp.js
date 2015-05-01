'use strict';

var React        = require('react');
var Router       = require('react-router');

var Header       = require('../views/partials/header');
var RouteHandler = Router.RouteHandler;
var MediaPlayer  = require('./media-player');

var CumulusApp   = React.createClass({

  // get access_token from config
  getInitialState: function () {
    return { }
  },

  componentDidMount: function() {

  },

  render: function() {

    return (
      <div>
        <Header />
        <RouteHandler />
        <MediaPlayer />
      </div>
    );
  }

});

module.exports = CumulusApp;