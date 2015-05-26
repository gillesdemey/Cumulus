'use strict';

var moment = require('moment')

exports.formatDuration = function(seconds) {
  seconds = seconds || 0
  var ms = seconds * 1000

  if (moment.duration(seconds, 'seconds').hours() < 1)
    return moment.utc(ms).format('m:ss')
  else
    return moment.utc(ms).format('H:mm:ss')
}