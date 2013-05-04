# pulldown-resolve

Resolve URLs, aliases and sets for pulldown.

```javascript
var resolve = require('pulldown-resolve');

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

Object.keys(registry).forEach(function (key) {
  console.log(key + ':', resolve(key, registry));
});
```

produces:

```
jquery: [ 'http://some.url.com/jquery.js' ]
underscore.js: [ 'http://some.url.com/underscore.js' ]
underscore: [ 'http://some.url.com/underscore.js' ]
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
```

## Install

`npm install pulldown-resolve`

## License

MIT