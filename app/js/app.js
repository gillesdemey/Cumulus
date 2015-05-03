'use strict';

var Remote          = window.require('remote');

var React           = require('react');
var Router          = require('react-router');

var CumulusApp      = require('./components/CumulusApp');

var About           = require('../views/about');
var Collection      = require('../views/collection');
var Feed            = require('../views/feed');

var Config          = Remote.require('./lib/config');
var SoundCloud      = window.SC;

/**
 * Router
 */
var Route  = Router.Route;
var routes = (
  <Route handler={CumulusApp} >
    <Router.DefaultRoute name="collection" handler={Collection}/>
    <Route name="feed"  handler={Feed}/>
    <Route name="about" handler={About}/>
  </Route>
);

/**
 * Start the router and render Cumulus
 */
function run() {
  Router.run(routes, function(Root) {
    React.render(<Root/>, document.getElementById('react'));
  });
}

/**
 * Configure the SoundCloud SDK
 */
Config.get('access_token', function(err, token) {

  if (err)
    throw err;

  SoundCloud.initialize({ 'access_token' : token });
  run();
})

module.exports = CumulusApp;
