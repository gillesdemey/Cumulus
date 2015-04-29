'use strict';

var request = require('request');

var SoundCloud = function(options) {

};

SoundCloud.prototype.makeRequest = function(url, options) {

  request({
    method : 'GET',
    url    : url
  });

};

module.exports = SoundCloud;