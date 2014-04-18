'use strict';

var GerritEventEmitter = require('../lib/gerrit-event-emitter').GerritEventEmitter,
    EventEmitter2 = require('eventemitter2').EventEmitter2,
    chai = require('chai'),
    expect = chai.expect;

describe('GerritEventEmitter', function() {
  beforeEach(function() {
    this.subject = new GerritEventEmitter('gerrit.example.com', 29418);
  });

  it('should inherit from EventEmitter2', function() {
    expect(this.subject).to.be.an.instanceof(EventEmitter2);
  });

  describe('#onStreamWrite(output)', function() {
    it('should emit gerrit stream event', function(done) {
      this.subject.on('commentAdded', function(eventData) {
        expect(eventData.id).to.be.equal(19234);
        done();
      });
      this.subject.onStreamWrite('{"type":"comment-added","id":19234}\n');
    });
  });

  describe('#toCamelizedEventName(hypenated-event-name)', function() {
    it('should return the camelized event name whose first letter is low', function() {
      var actual = this.subject.toCamelizedEventName('patchset-created');
      expect(actual).to.be.equal('patchsetCreated');
    });
  });
});
