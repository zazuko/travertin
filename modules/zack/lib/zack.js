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
    dummyRow: options.dummyResult,
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

  return this.fetchResultLength().then(function (length) {
    if (self.options.onLoadedResultLength) {
      self.options.onLoadedResultLength(length)
    }

    return self.clusterize.init(length)
  })
}

Zack.prototype.buildCountQuery = function () {
  return this.options.countQueryTemplate.replace('${searchString}', this.query)
}

Zack.prototype.fetchResultLength = function () {
  var query = this.buildCountQuery()

  return this.client.postQuery(query).then(function (res) {
    var triple = res.graph.match(null, 'http://voc.zazuko.com/zack#numberOfResults').toArray().shift()

    if (!triple) {
      return 0
    }

    return parseInt(triple.object.nominalValue)
  })
}

Zack.prototype.buildSearchQuery = function (offset) {
  return this.options.searchQueryTemplate
    .replace('${searchString}', this.query)
    .replace('${offset}', offset)
    .replace('${limit}', this.options.pageSize)
}

Zack.prototype.fetchPage = function (offset) {
  var query = this.buildSearchQuery(offset)

  return this.client.postQuery(query).then(function (res) {
    return res.graph
  })
}

Zack.prototype.resultSubjects = function (page) {
  return page.match(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', this.options.resultType).map(function (triple) {
    return triple.subject
  })
}

Zack.prototype.loadRows = function (offset) {
  var self = this

  return this.fetchPage(offset).then(function (page) {
    var subjects = self.resultSubjects(page)

    return subjects.map(function (subject, index) {
      return self.options.renderResult(page, subject)
    })
  })
}

module.exports = Zack
