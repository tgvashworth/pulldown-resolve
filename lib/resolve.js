var _ = require('underscore'),
    async = require('async'),
    url = require('url');

var emptyHelper = function (identifier, cb) { return cb(null, []); };
var isUrl = function (str) {
  return !!url.parse(str, true, true).hostname;
};

var resolve = function (identifier, options, cb) {
  var registry = options.registry || {},
      helper = options.helper || emptyHelper,
      cb = cb || function () {};

  // If the identifier's a URL, send it awn back.
  // This happens in sets.
  if (isUrl(identifier)) return cb(null, [identifier]);

  // Ok, so it's an identifier or an alias.
  var result = registry[identifier];

  // It wasn't found in the registry, so defer to the helper
  if (!result) return helper(identifier, function (err, set) {
    // We get back as set (array) from the helper, so we need to reiterate
    // through that set to attempt to resolve them locally
    async.map(set, function (subIdentifier, done) {
      return resolve(subIdentifier, options, done);
    }, function (err, set) {
      // Flatten and uniqify it. Just strings, innit.
      cb(null, _.uniq(_.flatten(set)));
    });
  });

  if (typeof result === "string") {
    // If it's a URL, send it back.
    if (isUrl(result)) return cb(null, [result]);
    // If it's not, resolve it. Recursive, yo.
    return resolve(result, options, cb);
  }

  // It's an array. Probably.
  if (!(result instanceof Array)) return cb(null, []);

  // Resolve each subidentifier
  async.map(result, function (subIdentifier, done) {
    return resolve(subIdentifier, options, done);
  }, function (err, set) {
    // Flatten and uniqify it. Just strings, innit.
    cb(null, _.uniq(_.flatten(set)));
  });
};

module.exports = resolve;