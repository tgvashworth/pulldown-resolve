var _ = require('underscore'),
    async = require('async'),
    EventEmitter = require('events').EventEmitter,
    url = require('url');

var emptyHelper = function (identifier, cb) { return cb(null, []); };
var isUrl = function (str) {
  return !!url.parse(str, true, true).hostname;
};

var resolve = Object.create(new EventEmitter());

resolve.setResolver = function (identifier, cb) {
  return function (err, set) {
    // Flatten and uniqify it. Just strings, innit.
    resolvedResult = _.uniq(_.flatten(set));
    resolve.emit('resolved', identifier, [].slice.call(resolvedResult));
    cb(null, resolvedResult);
  };
};

resolve.identifier = function identifier(identifier, options, cb) {
  var registry = options.registry || {},
      helper = options.helper || emptyHelper,
      cb = cb || function () {};

  resolve.emit('resolving', identifier);

  // If the identifier's a URL, send it awn back.
  // This happens in sets.
  if (isUrl(identifier)) {
    resolve.emit('resolved', identifier, [identifier]);
    return cb(null, [identifier]);
  }

  // Ok, so it's an identifier or an alias.
  var result = registry[identifier];

  // It wasn't found in the registry, so defer to the helper
  if (!result) {
    resolve.emit('helper:resolving', identifier);
    return helper(identifier, function (err, set) {
      if (err) return cb(err);
      resolve.emit('resolved', identifier, set);
      resolve.emit('helper:resolved', identifier, set);
      // We get back as set (array) from the helper, so we need to reiterate
      // through that set to attempt to resolve them locally
      async.map(set, function (subIdentifier, done) {
        return resolve.identifier(subIdentifier, options, done);
      }, resolve.setResolver(identifier, cb));
    });
  }

  resolve.emit('resolved', identifier, result);

  if (typeof result === "string") {
    // If it's a URL, send it back.
    if (isUrl(result)) {
      return cb(null, [result]);
    }
    // If it's not, resolve it. Recursive, yo.
    return resolve.identifier(result, options, cb);
  }

  // It's an array. Probably.
  if (!(result instanceof Array)) {
    return cb(null, []);
  }

  // Resolve each subidentifier
  async.map(result, function (subIdentifier, done) {
    return resolve.identifier(subIdentifier, options, done);
  }, resolve.setResolver(identifier, cb));
};

module.exports = resolve;