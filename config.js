'use strict';

var
  SparqlHandler = require('./lib/sparql-handler');


module.exports = {
  listener: {
    port: 9091
  },
  HandlerClass: SparqlHandler,
  handlerOptions: {
    endpointUrl: 'http://localhost:3030/alod/sparql',
    port: 3030
  }
};