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

    if ('_headers' in res) {
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
    if('Content-Type' in headers && headers['Content-Type'].indexOf('utf-8') < 0) { headers['Content-Type'] = headers['Content-Type'] + '; charset=utf-8;'; }
  }

  return headers;
};

module.exports = {
  app: 'zazuko-alod',
  logger: {
    level: 'debug'
  },
  listener: {
    port: 9091
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
      endpointUrl:'http://localhost:3030/alod/sparql'
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


/*global.rdf = require('rdf-interfaces');
require('rdf-ext')(rdf);

var
  fs = require('fs'),
  graphSplit = require('./lib/graph-split')(rdf);


var init = function () {
  var config = this;

  var importGraph = function (filename) {
    return new Promise(function (resolve) {
      rdf.parseTurtle(fs.readFileSync(filename).toString(), function (graph) {
        resolve(graph);
      });
    });
  };

  return Promise.all([
    importGraph('./data/graphs/bar.ttl'),
    importGraph('./data/graphs/ne.ttl')
  ]).then(function (graphs) {
    var mergedGraph = rdf.createGraph();

    graphs.forEach(function (graph) {
      mergedGraph.addAll(graph);
    });

    config.handlerOptions.storeOptions = {
      graph: mergedGraph,
      split: graphSplit.subjectIriSplit
    };
  });
};


module.exports = {
  app: 'zazuko-alod',
  logger: {
    level: 'debug'
  },
  listener: {
    port: 9091
  },
  expressSettings: {
    'trust proxy': 'loopback'
  },
  init: init,
  HandlerClass: require('./lib/ldp-module-handler'),
  handlerOptions: {
    rdf: rdf,
    StoreClass: graphSplit.SplitStore
  }
};*/
