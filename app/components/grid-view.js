'use strict';

var React    = require('react');

var GridView = React.createClass({

  render: function() {

    var createItem = function(item, index) {
      return (
        <GridItem
          className="cover-view__item"
          key={index}>
            {item}
        </GridItem>

      );

    };

    return (
      <div className="cover-view">
        {this.props.items.map(createItem)}
      </div>
    );
  }

});

module.exports = GridView;