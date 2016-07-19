/* global $ */

var Promise = require('bluebird')
var fetch = require('isomorphic-fetch')
var rdfFetch = require('rdf-fetch')
var RDF2h = require('rdf2h')
var SparqlClient = require('sparql-http-client')
var ClusterizePaging = require('./clusterize-paging')
var debounce = require('debounce')

SparqlClient.fetch = rdfFetch

function archivalResources (graph) {
  return graph
    .match(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://data.archiveshub.ac.uk/def/ArchivalResource')
    .map(function (triple) {
      return triple.subject
    })
}

function SearchResultList (options) {
  this.options = options || {}

  this.client = new SparqlClient({
    updateUrl: options.endpointUrl
  })

  this.renderer = new RDF2h(options.matchers)

  this.rows = []

  this.clusterize = new ClusterizePaging({
    rows: this.rows,
    scrollId: 'scrollArea',
    contentId: 'contentArea',
    dummyRow: SearchResultList.dummyRow,
    no_data_text: 'No results found matching the filters.',
    pageSize: options.pageSize,
    preload: options.preload,
    callbacks: {
      loadRows: this.loadRows.bind(this)
    }
  })

  this.search() //preload resultlist
}

SearchResultList.prototype.search = function (query, offset) {
  var self = this

  this.query = this.prepareSearchString(query)

  return this.resultLength().then(function (length) {
    document.getElementById('count').innerHTML = length
    document.getElementById('scrollArea').scrollTop = 0
    return self.clusterize.init(length)
  })
}

SearchResultList.prototype.resultLength = function () {
  var query = this.options.countSparql.replace('${searchString}', this.query)

  return this.client.postQuery(query).then(function (res) {
    var triple = res.graph.match(null, 'http://voc.zazuko.com/zack#numberOfResults').toArray().shift()

    if (!triple) {
      return 0
    }

    return parseInt(triple.object.nominalValue)
  })
}

SearchResultList.prototype.fetchPage = function (offset) {
  var query = this.options.searchSparql
    .replace('${searchString}', this.query)
    .replace('${offset}', offset)
    .replace('${limit}', this.options.pageSize)

  return this.client.postQuery(query).then(function (res) {
    return res.graph
  })
}

SearchResultList.prototype.loadRows = function (rows, offset) {
  var self = this

  return this.fetchPage(offset).then(function (page) {
    var subjects = archivalResources(page)

    subjects.forEach(function (subject, index) {
      var level = page.match(subject, 'http://data.archiveshub.ac.uk/def/level').toArray().shift()
      var title = page.match(subject, 'http://purl.org/dc/elements/1.1/title').toArray().shift()

      rows[offset + index] = '<div class="zack-result"><a href="' + subject.toString() + '">' + level.object.toString() + ' - ' + title.object.toString() + '</a></div>'

//      rows[offset + index] = self.renderer.render(page, subject.toString())
    })

    return rows
  })
}


SearchResultList.prototype.prepareSearchString = function (searchString) {
    if (typeof searchString === 'string' && searchString.trim() != '') {
        //searchString = '\\\"'+searchString.replace('"','').trim()+'\\\"~'
        searchString = searchString.replace('"','').trim()
    } else {
        searchString = '*'
    }
    return searchString
}

SearchResultList.dummyRow = '<div class="zack-result"></div>'

// patch mediaType -> parser map
rdfFetch.defaults.formats.parsers['application/octet-stream'] = rdfFetch.defaults.formats.parsers['text/turtle']

Promise.all([
  fetch('search-result-list.sparql').then(function (res) {
    return res.text()
  }),
  fetch('search-result-list.count.sparql').then(function (res) {
    return res.text()
  })
  /*  rdfFetch('//rawgit.com/zazukoians/trifid-ld/master/data/public/rdf2h/matchers.ttl').then(function (res) {
    return res.graph
  })
  rdfFetch('//cdn.zazuko.com/rdf2h/rdf2h.github.io/v0.0.1/2015/rdf2h-points.ttl').then(function (res) {
    return res.graph
  }) */
]).spread(function (searchSparql, countSparql, matcher) {
  var list = new SearchResultList({
    endpointUrl: 'http://data.admin.ch:3030/alod/query',
    searchSparql: searchSparql,
    countSparql: countSparql,
    pageSize: 10,
    preload: 30,
    matcher: matcher
  })

  document.getElementById('query').onkeyup = debounce(function () {
    list.search(document.getElementById('query').value)
  }, 250)

})

