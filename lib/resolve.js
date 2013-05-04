var _ = require('underscore'),
    async = require('async');

var emptyHelper = function (identifier, cb) { return cb(null, []); };
var url = /\/\//;

var resolve = function (identifier, options, cb) {
  var registry = options.registry || {},
      helper = options.helper || emptyHelper,
      cb = cb || function () {};

  // If the identifier's a URL, send it awn back.
  // This happens in sets.
  if (identifier.match(url)) return cb(null, [identifier]);

  // Ok, so it's an identifier or an alias.
  var result = registry[identifier];
  if (!result) return helper(identifier, cb);

  // It's a string.
  // If it's a URL, send it back.
  // If it's not, resolve it. Recursive, yo.
  if (typeof result === "string") {
    if (result.match(url)) return cb(null, [result]);
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