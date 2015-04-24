'use strict';

var app = require('app');
var fs  = require('fs');

var CONFIG_FILE = app.getPath('userData') + '/config.json';

exports.set = function(key, value, callback) {

  var data = {};
  data[key] = value;

  fs.writeFile(CONFIG_FILE, JSON.stringify(data), function(err) {
    if (err)
      return callback(err);

    callback(null);
  });

};

exports.get = function(key, callback) {

  fs.readFile(CONFIG_FILE, function(err, data) {

    if (err) {
      switch (err.code) {
        // if the config file doesn't exist, we asssume undefined for the key value
        case 'ENOENT':
          return callback(null, undefined);
        default:
          return callback(err);
      }
    }

    data = JSON.parse(data);

    return callback(null, data[key]);
  })

}