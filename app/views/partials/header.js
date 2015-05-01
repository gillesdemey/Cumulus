'use strict';

var React = require('react');
var Link  = require('react-router').Link;

var Header = React.createClass({

  render: function() {
    return (
      <header>
        <ul>
          <li><Link to="collection">Collection</Link></li>
          <li><Link to="feed">Feed</Link></li>
          <li><Link to="about">About</Link></li>
        </ul>
      </header>
    );
  }

});

module.exports = Header;
