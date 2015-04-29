var FEED       = 'feed';
var COLLECTION = 'collection';

var CumulusApp = React.createClass({

  // get access_token from config
  getInitialState: function () {
      return { nowShowing: COLLECTION };
  },

  componentDidMount: function() {
    var setState = this.setState;

    var router = Router({
      '/': setState.bind(this, { nowShowing: COLLECTION }),
      '/': setState.bind(this, { nowShowing: COLLECTION })
    });
    router.init();
  },

  render: function() {

    var header = (
      <h1>Cumulus</h1>
    );

    var collectionView = (
      <CollectionView tabs={[ 'overview', 'likes', 'playlists', 'following' ]}>
      </CollectionView>
    )

    var feedView = (
      <div className="feed-view"></div>
    );

    var player = (
      <MediaPlayer></MediaPlayer>
    );

    return (
      <div>
        {header}
          {this.state.nowShowing === FEED       ? feedView : ''}
          {this.state.nowShowing === COLLECTION ? collectionView : ''}
        {player}
      </div>
    );
  }

});

React.render(<CumulusApp />, document.getElementById('cumulusapp'));