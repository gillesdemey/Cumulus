'use strict';

var Remote          = window.require('electron').remote; // hack for browserify

var React           = require('react');
var Router          = require('react-router');

var CumulusApp      = require('./components/CumulusApp');

var About           = require('./components/aboutView');
var Likes           = require('./components/likesView');
var Feed            = require('./components/feedView');
var Playlists       = require('./components/playlistsView');

var settings        = Remote.require('electron-settings');
var SoundCloud      = require('./utils/soundcloud');

/**
 * Router
 */
var Route  = Router.Route;
var routes = (
  <Route handler={CumulusApp} >
    <Router.DefaultRoute name="feed" handler={Feed}/>
    <Route name="likes" handler={Likes}/>
    <Route name="playlists" handler={Playlists}/>
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
const token = settings.get('access_token')
if (!token) throw new Error('Refusing to initialize application, authentication token not found.')

SoundCloud.initialize({
  'access_token' : token,
  'client_id'    : 'f17c1d67b83c86194fad2b1948061c9e'
});
run();

module.exports = CumulusApp;
