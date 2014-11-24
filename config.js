/* global rdf:false */

'use strict';

/*module.exports = {
  listener: {
    port: 9091
  },
  HandlerClass: require('./lib/sparql-handler'),
  handlerOptions: {
    endpointUrl: 'http://localhost:3030/alod/sparql',
    port: 3030
  }
};*/


global.rdf = require('rdf-interfaces');
require('rdf-ext')(rdf);
require('./file-store')(rdf);


module.exports = {
  listener: {
    port: 9091
  },
  HandlerClass: require('./lib/ldp-module-handler'),
  handlerOptions: {
    rdf: rdf,
    StoreClass: rdf.FileStore,
    storeOptions: {path: 'data'}
  }
};