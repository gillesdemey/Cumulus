'use strict';

var React         = require('react');
var GridItem      = require('../components/GridItem');

var SoundCloud    = window.SC;

var CollectionView = React.createClass({

  getInitialState: function () {
    return {
      'favorites' : []
    };
  },

  componentWillMount: function () {

    SoundCloud.get('http://api.soundcloud.com/me/favorites.json', function(items) {
      console.log(items);

      if (!this.isMounted())
        return;

      // higher-resolution album covers
      items.map(function(item) {
        if (item.artwork_url)
          item.artwork_url = item.artwork_url.replace('-large', '-t200x200');
      })

      // append client key from streaming
      items.map(function(item) {
        if (item.stream_url)
          item.stream_url += '?client_id=apigee';
      })

      this.setState({
        'favorites' : items
      });

    }.bind(this));

  },

  render: function() {

    return (
      <div>
        {this.state.favorites.map(function(item) {
          return (
            <GridItem key={item.id}
              id={item.id}
              audio={new window.Audio(item.stream_url)}
              cover={item.artwork_url}
              title={item.title}
              artist={item.user.username}
            >
            </GridItem>
          )
        })}
      </div>
    );
  }

});

module.exports = CollectionView;