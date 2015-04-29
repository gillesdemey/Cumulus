var CollectionView = React.createClass({

  getInitialState: function () {
    return {
      active_tab : this.props.tabs[0],
      items      : [ 'foo', 'bar' ]
    };

  },

  render: function() {

    var tabView = (
      <ul>
        {this.props.tabs.map(function(tab, index) {
          return <li key={index}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</li>
        })}
      </ul>
    );

    return (
      <div>
        {tabView}
        <GridView items={this.state.items}></GridView>
      </div>
    );
  }

});