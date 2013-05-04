var _ = require('underscore');

var resolve = function (identifier, registry) {
  var url = /\/\//;

  // If it's a URL, send it awn back.
  // This happens in sets.
  if (identifier.match(url)) return [identifier];

  // Ok, so it's an identifier or an alias.
  var result = registry[identifier];
  if (!result) return [];

  // It's a string.
  // If it's a URL, send it back.
  // If it's not, resolve it. Recursive, yo.
  if (typeof result === "string") {
    if (result.match(url)) return [result];
    return resolve(result, registry);
  }

  // It's an array. Probably.
  if (!(result instanceof Array)) return [];

  // Resolve each subidentifier
  var set = result.map(function (subIdentifier) {
    return resolve(subIdentifier, registry);
  });

  // Flatten and uniqify it. Just strings, innit.
  return _.uniq(_.flatten(set));
};

module.exports = resolve;