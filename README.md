# pulldown-resolve

[![build status](https://secure.travis-ci.org/phuu/pulldown-resolve.png)](http://travis-ci.org/phuu/pulldown-resolve)

Resolve URLs, aliases and sets for pulldown.

```javascript
var resolve = require('pulldown-resolve');

var registry = {
  // Canonical
  'jquery': 'http://some.url.com/jquery.js',
  'underscore.js': 'http://some.url.com/underscore.js',
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

var opts = {
  registry: registry,
  // The helper method resolves unknown URLs
  helper: function (identifier, cb) {
    return cb(null, ['http://angular']);
  }
};

Object.keys(registry).forEach(function (key) {
  resolve(key, opts, function (err, set) {
    console.log(key + ':', set);
  });
});
```

produces:

```
jquery: [ 'http://some.url.com/jquery.js' ]
underscore.js: [ 'http://some.url.com/underscore.js' ]
underscore: [ 'http://some.url.com/underscore.js' ]
angular: [ 'http://angular' ]
backbone: [ 'http://some.url.com/backbone.js',
  'http://some.url.com/underscore.js',
  'http://some.url.com/jquery.js' ]
app: [ 'http://some.url.com/backbone.js',
  'http://some.url.com/underscore.js',
  'http://some.url.com/jquery.js',
  'http://some.thing.com/app.js' ]
duped: [ 'http://some.url.com/backbone.js',
  'http://some.url.com/underscore.js',
  'http://some.url.com/jquery.js' ]
async: [ 'http://angular',
  'http://some.url.com/backbone.js',
  'http://some.url.com/underscore.js',
  'http://some.url.com/jquery.js',
  'http://some.thing.com/app.js' ]
```

## Install

`npm install pulldown-resolve`

## License

MIT