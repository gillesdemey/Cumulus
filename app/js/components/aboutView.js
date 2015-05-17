'use strict';

var React     = require('react');

var AboutView = React.createClass({

  componentWillUnmount: function() {

  },

  render: function() {

    return (
      <div>
        <p>Built with Electron &amp; React</p>
      </div>
    );
  }

});

module.exports = AboutView;