'use strict';

var
  handlerMiddleware = require('./handler-middleware'),
  SparqlHandler = require('./sparql-handler');


module.exports = function (options) {
  var
    sparqlHandler,
    wrapperHandler = {};

  var escapeLiteral = function (value) {
    return value.replace(/"/g, '\\"')
  };

  var replaceVariable = function (query, variable, value) {
    return query.split(variable).join('"""' + escapeLiteral(value) + '"""');
  };

  wrapperHandler.get = function (req, res, next, iri) {
    sparqlHandler.buildQuery = function () {
      var
        query = options.queryTemplate;

      if ('variables' in options) {
        Object.keys(options.variables).forEach(function (parameter) {
          if (parameter in req.query && req.query[parameter].trim() !== '') {
            query = replaceVariable(query, options.variables[parameter], req.query[parameter]);
          }
        });
      }

      return query;
    };

    return sparqlHandler.get(req, res, next, iri);
  };

  sparqlHandler = new SparqlHandler({endpointUrl: options.endpointUrl});

  return handlerMiddleware(wrapperHandler);
};