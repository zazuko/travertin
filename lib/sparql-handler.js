'use strict';

var
  request = require('request'),
  url = require('url');


module.exports = function (options) {
  var mapIri = function (iri) {
    var parsed = url.parse(iri);

    if ('hostname' in options) {
      parsed.hostname = options.hostname;
    }

    if ('port' in options) {
      parsed.port = options.port;
    }

    delete parsed.host;

    return url.format(parsed);
  };

  var getSparqlUrl = function (query) {
    return options.endpointUrl + '?query=' + encodeURIComponent(query);
  };

  this.get = function (req, res, next, iri) {
    var query = 'CONSTRUCT {?s ?p ?o} WHERE { GRAPH <' + mapIri(iri) + '> {?s ?p ?o}}';

    request
      .get(getSparqlUrl(query))
      .on('response', function(response) {
        if (response.statusCode !== 200) {
          res.sendStatus(500);
        }
      })
      .pipe(res);
  };
};