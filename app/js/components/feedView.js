'use strict';

var React         = require('react')
var ListItem      = require('./ListItem')

var classNames    = require('classnames')

var Actions       = require('../actions/actionCreators')
var FeedStore     = require('../stores/feedStore')

function getStateFromStores() {
  return {
    'feed'    : FeedStore.getFeed(),
    'loading' : FeedStore.getFeed().length === 0
  }
}

var FeedView = React.createClass({

  getInitialState: function () {
    return getStateFromStores()
  },

  componentWillMount: function() {
    FeedStore.addChangeListener(this._onChange)

    if (FeedStore.getFeed().length === 0)
      Actions.fetchFeed()
  },

  componentWillUnmount: function() {
    FeedStore.removeChangeListener(this._onChange)
  },

  _onChange: function() {
    this.setState(getStateFromStores())
  },

  render: function() {

    var classes = classNames({
      'content__view__feed' : true,
      'loading'             : this.state.loading
    })

    return (
      <div className={classes}>
        {this.state.feed.map(function(track) {
          return (
            <ListItem
              key   = {track.id}
              track = {track}
            >
            </ListItem>
          )
        })}
      </div>
    );
  }

});

module.exports = FeedView