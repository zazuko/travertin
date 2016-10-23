var baseConfig = require('trifid-ld/config.fuseki');
var defaultsDeep = require('lodash/defaultsDeep');

var config = {
  listener: {
    port: 8080
  },
  handlerOptions: {
    endpointUrl: 'http://data.admin.ch:3030/alod/sparql',
  },
  sparqlProxy: {
    path: '/sparql',
    options: {
      endpointUrl:'http://data.admin.ch:3030/alod/sparql',
    }
  }
}

module.exports = defaultsDeep(config, baseConfig)
