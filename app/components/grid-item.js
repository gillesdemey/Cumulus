'use strict';

var React    = require('react');

var GridItem = React.createClass({
  render: function() {
    return (
      <div className="cover-item">{this.props.item}</div>
    );
  }

});

module.exports = GridItem;