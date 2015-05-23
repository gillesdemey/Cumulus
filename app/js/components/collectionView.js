'use strict';

var React         = require('react')
var ListItem      = require('./ListItem')

var Actions       = require('../actions/actionCreators')
var TrackStore    = require('../stores/trackStore')

function getStateFromStores() {
  return {
    'collection' : TrackStore.getCollection(),
  }
}

var CollectionView = React.createClass({

  getInitialState: function () {
    return getStateFromStores()
  },

  componentWillMount: function() {
    TrackStore.addChangeListener(this._onChange)

    if (TrackStore.getCollection().length === 0)
      Actions.fetchCollection()
  },

  componentWillUnmount: function() {
    TrackStore.removeChangeListener(this._onChange)
  },

  _onChange: function() {
    this.setState(getStateFromStores())
  },

  render: function() {

    return (
      <div>
        {this.state.collection.map(function(item) {
          return (
            <ListItem
              key   = {item.id}
              track = {item}
            >
            </ListItem>
          )
        })}
      </div>
    );
  }

});

module.exports = CollectionView