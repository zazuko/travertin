var isomorphicFetch = require('isomorphic-fetch')
var SparqlClient = require('sparql-http-client')

SparqlClient.fetch = isomorphicFetch

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
    .replace(/\${width}/g, document.getElementById('zack-timeline').offsetWidth)

  this.client.selectQuery(query).then(function (res) {
    console.log(res)
  })
}

module.exports = Histogram
