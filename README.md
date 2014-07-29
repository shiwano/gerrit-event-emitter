# gerrit-event-emitter [![Build Status](https://secure.travis-ci.org/shiwano/gerrit-event-emitter.png?branch=master)](http://travis-ci.org/shiwano/gerrit-event-emitter)

A thin wrapper of [gerrit-stream](https://github.com/fivetanley/gerrit-stream) for Node.js.

## Getting Started
Install the module with: `npm install gerrit-event-emitter`

```javascript
var GerritEventEmitter = require('gerrit-event-emitter').GerritEventEmitter,
    gerritEventEmitter = new GerritEventEmitter('gerrit.example.com', 29418);

gerritEventEmitter.on('patchsetCreated', function(eventData) {
  // do something.
});
gerritEventEmitter.start() // start gerrit-stream process.
```

## Documentation

The `GerritEventEmitter` class inherited from [EventEmitter2](https://github.com/hij1nx/EventEmitter2).
So you can use EventEmitter2 methods basically.

### Constructor

```javascript
new GerritEventEmitter(host, port, [, enabledAutoRestart ]);
```

### Available events

* `patchsetCreated`
* `changeAbandoned`
* `changeRestored`
* `changeAbandoned`
* `changeRestored`
* `changeMerged`
* `commentAdded`
* `refUpdated`
* `gerritStreamWrite`
* `gerritStreamEnd`

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
 * 2014-07-29   v0.1.5   Fix process stop bug
 * 2014-04-28   v0.1.4   Support auto restart and gerrit-stream events.
 * 2014-04-19   v0.1.3   Add start/stop methods.
 * 2014-04-19   v0.1.2   Fix dependencies.
 * 2014-04-18   v0.1.1   First release.

## License
Copyright (c) 2014 Shogo Iwano
Licensed under the MIT license.
