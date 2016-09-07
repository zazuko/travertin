var SparqlClient = require('sparql-http-client')

function Histogram (options) {
  this.options = options || {}

  this.client = new SparqlClient({
    endpointUrl: options.endpointUrl,
    updateUrl: options.endpointUrl
  })
}

Histogram.prototype.render = function (searchString) {
  var query = this.buildQuery()
    .replace(/\${searchString}/g, searchString)
    .replace(/\${width}/g, window.innerWidth)

  console.log('histogram query:' + query)
}

module.exports = Histogram
