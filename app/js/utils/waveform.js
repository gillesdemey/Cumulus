'use strict';

/**
 * Modified waveform.js
 *
 * Copyright © Gilles De Mey 2015
 */

var _ = require('lodash')

module.exports = Waveform;

function Waveform(options) {

  this.middle      = options.middle || 2;
  this.gap         = options.gap || 1;
  this.colWidth    = options.colWidth || 1;
  this.numBars     = options.numBars;

  this.redraw      = this.redraw;
  this.container   = options.container;
  this.canvas      = options.canvas;
  this.data        = options.data || [];
  this.outerColor  = options.outerColor || "transparent";
  this.innerColor  = options.innerColor || "#000000";
  this.interpolate = true;

  if (options.interpolate === false) {
    this.interpolate = false;
  }
  if (this.canvas == null) {
    if (this.container) {
      this.canvas = this.createCanvas(this.container, options.width || this.container.clientWidth, options.height || this.container.clientHeight);
    } else {
      throw "Either canvas or container option must be passed";
    }
  }

  this.context = this.canvas.getContext("2d");
  this.width   = parseInt(this.context.canvas.width, 10) / (this.gap * this.colWidth);
  this.height  = parseInt(this.context.canvas.height, 10);

  if (options.data) {
    this.update(options);
  }

}

Waveform.prototype.setData = function(data) {

  function median(values) {
    values = _.sortBy(values, _.identity);

    var half = Math.floor(values.length / 2);

    if (values.length % 2)
      return values[half];
    else
      return (values[half-1] + values[half]) / 2.0;
  }

  var chunkSize = this.length / this.gap;

  data = _.chain(data)
    .map(function(n) {
      return n / Math.max.apply(null, data);
    })
    .chunk(chunkSize)
    .map(function(chunk) {
      var m = median(chunk);
      chunk = _.map(chunk, function(n) {
        return m;
      });

      return chunk;
    })
    .flatten()
    .value();

  this.data = data;

  return data;
};

Waveform.prototype.setDataInterpolated = function(data) {
  return this.setData(this.interpolateArray(data, this.width));
};

Waveform.prototype.setDataCropped = function(data) {
  return this.setData(this.expandArray(data, this.width));
};

Waveform.prototype.update = function(options) {
  if (!options.data || options.data.length === 0)
    return this.clear();

  if (options.interpolate != null) {
    this.interpolate = options.interpolate;
  }
  if (this.interpolate === false) {
    this.setDataCropped(options.data);
  } else {
    this.setDataInterpolated(options.data);
  }
  return this.redraw();
};

Waveform.prototype.redraw = function() {
  var d, i, middle, _i, _len, _ref, _results;
  var colWidth = this.colWidth;
  this.clear();
  if (typeof this.innerColor === "function") {
    this.context.fillStyle = this.innerColor();
  } else {
    this.context.fillStyle = this.innerColor;
  }
  middle = this.height / this.middle;
  i = 0;
  _ref = this.data;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    d = _ref[_i];
    if (typeof this.innerColor === "function") {
      this.context.fillStyle = this.innerColor(i / this.width, d);
    }
    this.context.clearRect((colWidth * i) * this.gap, middle - middle * d, colWidth, middle * d * 2);
    this.context.fillRect((colWidth * i) * this.gap, middle - middle * d, colWidth, middle * d * 2);
    _results.push(i++);
  }
  return _results;
};

Waveform.prototype.clear = function() {
  var canvasWidth =  this.width * (this.gap * this.colWidth)
  this.context.fillStyle = this.outerColor;
  this.context.clearRect(0, 0, canvasWidth, this.height);
  return this.context.fillRect(0, 0, canvasWidth, this.height);
};

Waveform.prototype.createCanvas = function(container, width, height) {
  var canvas;
  canvas = document.createElement("canvas");
  container.appendChild(canvas);
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

Waveform.prototype.expandArray = function(data, limit, defaultValue) {
  var i, newData, _i, _ref;
  if (defaultValue == null) {
    defaultValue = 0.0;
  }
  newData = [];
  if (data.length > limit) {
    newData = data.slice(data.length - limit, data.length);
  } else {
    for (i = _i = 0, _ref = limit - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      newData[i] = data[i] || defaultValue;
    }
  }
  return newData;
};

Waveform.prototype.linearInterpolate = function(before, after, atPoint) {
  return before + (after - before) * atPoint;
};

Waveform.prototype.interpolateArray = function(data, fitCount) {
  var after, atPoint, before, i, newData, springFactor, tmp;
  newData = [];
  springFactor = (data.length - 1) / (fitCount - 1);
  newData[0] = data[0];
  i = 1;
  while (i < fitCount - 1) {
    tmp = i * springFactor;
    before = Math.floor(tmp).toFixed();
    after = Math.ceil(tmp).toFixed();
    atPoint = tmp - before;
    newData[i] = this.linearInterpolate(data[before], data[after], atPoint);
    i++;
  }
  newData[fitCount - 1] = data[data.length - 1];
  return newData;
};