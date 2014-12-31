/* global rdf:false */

'use strict';


var buildQuery = function (iri) {
  return 'DESCRIBE <' + iri + '>';
};

module.exports = {
  listener: {
    port: 9091
  },
  HandlerClass: require('./lib/sparql-handler'),
  handlerOptions: {
    endpointUrl: 'http://localhost:3030/alod/sparql',
    //hostname: 'data.admin.ch',
    port: null,
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

  return new Promise(function (resolve) {
    rdf.parseTurtle(fs.readFileSync('./data/graph.ttl').toString(), function (graph) {
      config.handlerOptions.storeOptions = {
        // optional map hostname port
        hostname: 'localhost',
        port: null,
        graph: graph,
        split: graphSplit.subjectIriSplit
      };

      resolve();
    });
  });
};


module.exports = {
  listener: {
    port: 9091
  },
  init: init,
  HandlerClass: require('./lib/ldp-module-handler'),
  handlerOptions: {
    rdf: rdf,
    StoreClass: graphSplit.SplitStore
  }
};*/