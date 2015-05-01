'use strict';

var React      = require('react');
var Router     = require('react-router');
var CumulusApp = require('../components/CumulusApp');

var About      = require('../views/about');
var Collection = require('../views/collection');
var Feed       = require('../views/feed');

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

Router.run(routes, function(Root) {
  React.render(<Root/>, document.body);
});
