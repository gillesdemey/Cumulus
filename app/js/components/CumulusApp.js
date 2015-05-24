'use strict';

var React        = require('react')
var RouteHandler = require('react-router').RouteHandler

var Header       = require('./headerSection')
var MediaPlayer  = require('./mediaPlayer')

var CumulusApp   = React.createClass({

  render: function() {

    return (
      <div className="cumulusapp">
        <Header />
        <div className='content__wrapper'>
          <RouteHandler />
        </div>
        <MediaPlayer />
      </div>
    )
  }

})

module.exports = CumulusApp
