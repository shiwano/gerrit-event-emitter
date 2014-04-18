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

var GerritEventEmitter = function GerritEventEmitter(host, port, gerritCommand) {
  var _this = this;
  EventEmitter2.call(_this);

  var gerritProcess = new GerritProcess(host, port, gerritCommand);
  var gerritStream = new GerritStream(gerritProcess.stdout);

  gerritStream.subscribeStream({
    write: function() {
      _this.onStreamWrite.apply(_this, arguments);
    },
    end: function() {
      _this.onStreamEnd.apply(_this, arguments);
    }
  });
};
util.inherits(GerritEventEmitter, EventEmitter2);

GerritEventEmitter.prototype.onStreamWrite = function(output) {
  var _this = this;

  output.toString('utf-8').split("\n").forEach(function(jsonString) {
    if (typeof jsonString !== 'string' || jsonString.length === 0) { return; }

    var eventData = JSON.parse(jsonString);
    var camelizedEventName = _this.toCamelizedEventName(eventData.type);
    _this.emit(camelizedEventName, eventData);
  });
};

GerritEventEmitter.prototype.onStreamEnd = function() {};

GerritEventEmitter.prototype.toCamelizedEventName = function(str) {
  return inflection.camelize(str.replace('-', '_'), true);
};

exports.GerritEventEmitter = GerritEventEmitter;
