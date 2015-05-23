'use strict';

var Remote          = window.require('remote');

var React           = require('react');
var Router          = require('react-router');

var CumulusApp      = require('./components/CumulusApp');

var About           = require('./components/aboutView');
var Collection      = require('./components/collectionView');
var Feed            = require('./components/feedView');

var Config          = Remote.require('./lib/config');
var SoundCloud      = require('./utils/soundcloud');

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

  if (!token)
    throw new Error('Refusing to initialize application, authentication token not found.')

  SoundCloud.initialize({
    'access_token' : token,
    'client_id'    : 'f17c1d67b83c86194fad2b1948061c9e'
  });

  run();
})

module.exports = CumulusApp;
