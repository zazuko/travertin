/* global rdf:false */

'use strict';

var
  fs = require('fs'),
  path = require('path');


var buildQuery = function (iri) {
  return 'DESCRIBE <' + iri + '>';
};

var buildExistsQuery = function (iri) {
  return 'ASK { GRAPH ?g { <' + iri + '> ?p ?o }}';
};

var patchResponseHeaders = function (res, headers) {
  if (res.statusCode === 200) {
    // clean existings values
    var fieldList = [
      'Access-Control-Allow-Origin',
      'Cache-Control',
      'Fuseki-Request-ID',
      'Server',
      'Vary'];

    if (res._headers) {
      fieldList.forEach(function (field) {
        if (field in res._headers) {
          delete res._headers[field];
        }

        if (field.toLowerCase() in res._headers) {
          delete res._headers[field.toLowerCase()];
        }
      });
    }

    // cors header
    headers['Access-Control-Allow-Origin'] = '*';

    // cache header
    headers['Cache-Control'] = 'public, max-age=120';

    // vary header
    headers['Vary'] = 'Accept';
  }

  return headers;
};

module.exports = {
  app: 'trifid-ld',
  logger: {
    level: 'debug'
  },
  listener: {
    port: 80
  },
  expressSettings: {
    'trust proxy': 'loopback',
    'x-powered-by': null
  },
  patchHeaders: {
    patchResponse: patchResponseHeaders
  },
  sparqlProxy: {
    path: '/alod/sparql',
    options: {
      endpointUrl:'http://localhost:3030/alod/sparql',
      queryOperation: 'urlencoded'
    }
  },
  sparqlSearch: {
    path: '/alod/search',
    options: {
      endpointUrl:'http://localhost:3030/alod/sparql',
      resultsPerPage: 10,
      queryTemplate: fs.readFileSync(path.join(__dirname, 'data/sparql/index-search.sparql')).toString(),
      variables: {
        'q': {
          variable: '%searchstring%',
          required: true
        },
        'graph': {
          variable: '?g',
          type: 'NamedNode'
        }
      }
    }
  },
  HandlerClass: require('./lib/sparql-handler'),
  handlerOptions: {
    endpointUrl: 'http://localhost:3030/alod/sparql',
    buildQuery: buildQuery,
    buildExistsQuery: buildExistsQuery
  }
};
