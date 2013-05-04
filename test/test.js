var resolve = require('../'),
    deepEqual = require('deeper'),
    t = require('tap');

var registry = {
  // Canonical
  'jquery': 'http://some.url.com/jquery.js',
  'underscore.js': 'http://some.url.com/underscore.js',
  // Alias
  'underscore': 'underscore.js',
  // Set
  'backbone': ['http://some.url.com/backbone.js', 'underscore', 'jquery'],
  // Depend on a set
  'app': ['backbone', 'http://some.thing.com/app.js'],
  // Duplication
  'duped': ['backbone', 'underscore']
};

var results = {
  'jquery': [ 'http://some.url.com/jquery.js' ],
  'underscore.js': [ 'http://some.url.com/underscore.js' ],
  'underscore': [ 'http://some.url.com/underscore.js' ],
  'backbone': [ 'http://some.url.com/backbone.js',
    'http://some.url.com/underscore.js',
    'http://some.url.com/jquery.js' ],
  'app': [ 'http://some.url.com/backbone.js',
    'http://some.url.com/underscore.js',
    'http://some.url.com/jquery.js',
    'http://some.thing.com/app.js' ],
  'duped': [ 'http://some.url.com/backbone.js',
    'http://some.url.com/underscore.js',
    'http://some.url.com/jquery.js' ]
};

Object.keys(registry).forEach(function (key) {
  t.test(key, function (t) {
    t.ok(deepEqual(results[key], resolve(key, registry)));
    t.end();
  });
});