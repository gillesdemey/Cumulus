'use strict';

var McFly = require('../utils/mcfly')

var visibleTab = ''  // the tab that is currently in view
var activeTab = ''   // the tab where we are currently Visible music from

function _setActiveTab(tab) {
  activeTab = tab
}

function _setVisibleTab(tab) {
  visibleTab = tab
}

var AppStore = McFly.createStore({

  getActiveTab: function() {
    return activeTab
  },

  getVisibleTab: function() {
    return visibleTab
  },

  isActiveTab: function(tab) {
    return tab === activeTab
  },

  isVisibleTab: function(tab) {
    return tab === visibleTab
  },

  setActiveTab: _setActiveTab,
  setVisibleTab: _setVisibleTab,

}, function(payload) {

  switch (payload.actionType) {

    case 'ACTIVE_TAB':
      _setActiveTab(payload.tab)
      break

    case 'VISIBLE_TAB':
      _setVisibleTab(payload.tab)
      break

  }

  AppStore.emitChange()

  return true
});

module.exports = AppStore
