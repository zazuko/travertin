'use strict';


module.exports = function (options) {
  if (options == null) {
    options = {};
  }

  return function (req, res, next) {
    for (var field in options) {
      req.headers[field] = options[field];
    }

    next();
  };
};