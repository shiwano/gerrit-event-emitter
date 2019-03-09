/*
 * gerrit-event-emitter
 * https://github.com/shiwano/gerrit-event-emitter
 *
 * Copyright (c) 2014 Shogo Iwano
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util'),
    inflection = require('inflection'),
    EventEmitter2 = require('eventemitter2').EventEmitter2,
    gerritStream = require('gerrit-stream'),
    GerritProcess = gerritStream.GerritProcess,
    GerritStream = gerritStream.GerritStream;

var GerritEventEmitter = function GerritEventEmitter(host, port, enabledAutoRestart) {
  EventEmitter2.call(this);
  this.host = host;
  this.port = port;
  this.enabledAutoRestart = enabledAutoRestart || false;

  this._process = null;
  this._stream = null;

  var _this = this;
  this._subscriber = {
    write: function() {
      _this.onStreamWrite.apply(_this, arguments);
    },
    end: function() {
      _this.onStreamEnd.apply(_this, arguments);
    }
  };
};
util.inherits(GerritEventEmitter, EventEmitter2);

GerritEventEmitter.prototype.start = function() {
  if (this.isStarted()) { return; }

  this._process = new GerritProcess(this.host, this.port);
  this._stream = new GerritStream(this._process.stdout);
  this._stream.subscribeStream(this._subscriber);
};

GerritEventEmitter.prototype.stop = function() {
  if (!this.isStarted()) { return; }

  this._stream.unsubscribeStream(this._subscriber);
  this._stream = null;
  this._process.kill();
  this._process = null;
};

GerritEventEmitter.prototype.isStarted = function() {
  return this._process !== null;
};

GerritEventEmitter.prototype.onStreamWrite = function(output) {
  this.emit('gerritStreamWrite', output);

  var _this = this;
  output.toString('utf-8').split("\n").forEach(function(jsonString) {
    if (typeof jsonString !== 'string' || jsonString.length === 0) { return; }

    try {
      var eventData = JSON.parse(jsonString);
      var camelizedEventName = _this.toCamelizedEventName(eventData.type);
      _this.emit(camelizedEventName, eventData);
    } catch (e) {
      console.error('Unable to parse JSON string:', e);
    }
  });
};

GerritEventEmitter.prototype.onStreamEnd = function(output) {
  this.stop();
  this.emit('gerritStreamEnd', output);

  if (this.enabledAutoRestart) {
    this.start();
  }
};

GerritEventEmitter.prototype.toCamelizedEventName = function(str) {
  return inflection.camelize(str.replace('-', '_'), true);
};

exports.GerritEventEmitter = GerritEventEmitter;
