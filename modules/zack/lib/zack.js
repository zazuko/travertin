var rdfFetch = require('rdf-fetch')
var SparqlClient = require('sparql-http-client')
var ClusterizePaging = require('./clusterize-paging')

SparqlClient.fetch = rdfFetch

function Zack (options) {
  this.options = options || {}

  this.client = new SparqlClient({
    endpointUrl: options.endpointUrl,
    updateUrl: options.endpointUrl
  })

  this.rows = []

  this.clusterize = new ClusterizePaging({
    rows: this.rows,
    scrollId: 'scrollArea',
    contentId: 'contentArea',
    dummyRow: options.dummyRow,
    no_data_text: 'No results found matching the filters.',
    pageSize: options.pageSize,
    preload: options.preload,
    callbacks: {
      loadRows: this.loadRows.bind(this)
    }
  })
}

Zack.prototype.search = function (query, offset) {
  var self = this

  this.query = query

  return this.resultLength().then(function (length) {
    if (self.options.onResultLength) {
      self.options.onResultLength(length)
    }

    return self.clusterize.init(length)
  })
}

Zack.prototype.resultLength = function () {
  var query = this.options.countSparql.replace('${searchString}', this.query)

  return this.client.postQuery(query).then(function (res) {
    var triple = res.graph.match(null, 'http://voc.zazuko.com/zack#numberOfResults').toArray().shift()

    if (!triple) {
      return 0
    }

    return parseInt(triple.object.nominalValue)
  })
}

Zack.prototype.fetchPage = function (offset) {
  var query = this.options.searchSparql
    .replace('${searchString}', this.query)
    .replace('${offset}', offset)
    .replace('${limit}', this.options.pageSize)

  return this.client.postQuery(query).then(function (res) {
    return res.graph
  })
}

Zack.prototype.loadRows = function (rows, offset) {
  var self = this

  return this.fetchPage(offset).then(function (page) {
    var subjects = self.options.rowSubjects(page)

    subjects.forEach(function (subject, index) {
      rows[offset + index] = self.options.renderRow(page, subject)
    })

    return rows
  })
}

module.exports = Zack
