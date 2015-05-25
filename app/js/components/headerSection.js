'use strict';

var React = require('react');
var Link  = require('react-router').Link;

var HeaderSection = React.createClass({

  render: function() {
    return (
      <header>
        <ul>
          <li>
            <Link to="feed">Feed</Link>
          </li>
          <li>
            <Link to="likes">Likes</Link>
          </li>
          <li>
            <Link to="playlists">Playlists</Link>
          </li>
        </ul>
      </header>
    );
  }

});

module.exports = HeaderSection;
