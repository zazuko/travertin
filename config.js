/* global rdf:false */

'use strict';


var buildQuery = function (iri) {
  return 'DESCRIBE <' + iri + '>';
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
  HandlerClass: require('./lib/sparql-handler'),
  handlerOptions: {
    endpointUrl: 'http://localhost:3030/alod/sparql',
    buildQuery: buildQuery
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