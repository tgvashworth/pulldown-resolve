var resolve = require('../'),
    deepEqual = require('deeper'),
    t = require('tap');

var registry = {
  // Canonical
  'jquery': '//some.url.com/jquery.js',
  'underscore.js': 'http://some.url.com/underscore.js',
  'angular-resource': 'http://some.url.com/angular-resource.js',
  // Alias
  'underscore': 'underscore.js',
  'angular': 'angular.js',
  // Set
  'backbone': ['http://some.url.com/backbone.js', 'underscore', 'jquery'],
  // Depend on a set
  'app': ['backbone', 'http://some.thing.com/app.js'],
  // Duplication
  'duped': ['backbone', 'underscore'],
  // Async
  'async': ['angular', 'app']
};

var results = {
  jquery: [ '//some.url.com/jquery.js' ],
  'underscore.js': [ 'http://some.url.com/underscore.js' ],
  'angular-resource': [ 'http://some.url.com/angular-resource.js' ],
  underscore: [ 'http://some.url.com/underscore.js' ],
  angular: [ 'http://angular', 'http://some.url.com/angular-resource.js' ],
  backbone: [ 'http://some.url.com/backbone.js',
    'http://some.url.com/underscore.js',
    '//some.url.com/jquery.js' ],
  app: [ 'http://some.url.com/backbone.js',
    'http://some.url.com/underscore.js',
    '//some.url.com/jquery.js',
    'http://some.thing.com/app.js' ],
  duped: [ 'http://some.url.com/backbone.js',
    'http://some.url.com/underscore.js',
    '//some.url.com/jquery.js' ],
  async: [ 'http://angular',
    'http://some.url.com/angular-resource.js',
    'http://some.url.com/backbone.js',
    'http://some.url.com/underscore.js',
    '//some.url.com/jquery.js',
    'http://some.thing.com/app.js' ]
};

var opts = {
  registry: registry,
  helper: function (identifier, cb) {
    return cb(null, ['http://angular', 'angular-resource']);
  }
};

Object.keys(registry).forEach(function (key) {
  t.test(key, function (t) {
    resolve.identifier(key, opts, function (err, set) {
      t.ok(deepEqual(results[key], set), key + ' matches');
      t.end();
    });
  });
});

// resolve.on('resolving', console.log.bind(console, 'resolving'));
// resolve.on('resolved', console.log.bind(console, 'resolved'));
// resolve.on('helper:resolving', console.log.bind(console, 'helper:resolving'));
// resolve.on('helper:resolved', console.log.bind(console, 'helper:resolved'));