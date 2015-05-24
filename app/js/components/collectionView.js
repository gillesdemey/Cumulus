'use strict';

var React         = require('react')
var ListItem      = require('./ListItem')

var classNames    = require('classnames')

var Actions       = require('../actions/actionCreators')
var LikesStore    = require('../stores/likesStore')

function getStateFromStores() {
  return {
    'collection' : LikesStore.getLikes(),
    'loading'    : LikesStore.getLikes().length === 0
  }
}

var CollectionView = React.createClass({

  getInitialState: function () {
    return getStateFromStores()
  },

  componentWillMount: function() {
    LikesStore.addChangeListener(this._onChange)

    if (LikesStore.getLikes().length === 0)
      Actions.fetchLikes()
  },

  componentWillUnmount: function() {
    LikesStore.removeChangeListener(this._onChange)
  },

  _onChange: function() {
    this.setState(getStateFromStores())
  },

  render: function() {

    var classes = classNames({
      'content__view__collection' : true,
      'loading'                   : this.state.loading
    })

    return (
      <div className={classes}>
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