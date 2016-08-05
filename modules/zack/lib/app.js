var Promise = require('bluebird')
var debounce = require('debounce')
var fetch = require('isomorphic-fetch')
var renderer = require('./renderer')
var Event = require('crab-event').Event
var QueryBuilder = require('./query-builder')
var Zack = require('./zack')

var app = {}

window.app = app

app.options = {
  endpointUrl: 'http://data.admin.ch:3030/alod/query',
  pageSize: 20,
  preload: 80,
  filterContainer: 'filter-container'
}

app.events = {
  fetched: new Event(),
  fetching: new Event(),
  filterChange: new Event(),
  loadedResultLength: new Event(),
  search: new Event()
}

app.isFetching = false

app.filters = []

function search () {
  var query = document.getElementById('query').value

  if (query.trim() !== '') {
    query = query.replace('"', '').trim()
  } else {
    query = '*'
  }

  app.zack.search(query)
}

function loadedResultLength (length) {
  document.getElementById('count').innerHTML = length
  document.getElementById('scrollArea').scrollTop = 0
}

app.updateFilters = function () {
  var elements = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'))

  app.filters = elements.filter(function (element) {
    return element.getAttribute('disabled') === null
  }).map(function (element, index) {
    var filter = {}

    filter.operator = element.getAttribute('data-filter')
    filter.inverse = element.getAttribute('data-inverse') !== null
    filter.predicate = element.getAttribute('data-predicate')
    filter.termType = element.getAttribute('data-named-node') !== null ? 'NamedNode' : 'Literal'
    filter.variable = 'filter' + index

    var eventName = 'onchange'
    var getValue = function (element) {
      var value = element.value || element.getAttribute('data-value')

      if (!value) {
        return null
      }

      if (filter.termType === 'NamedNode') {
        return '<' + value + '>'
      } else {
        return '"' + value + '"' // TODO: escape literal
      }
    }

    if (element.nodeName.toLowerCase() === 'input' && element.type.toLowerCase() === 'date') {
      eventName = 'onblur'

      getValue = function (element) {
        if (element.value) {
          return 'xsd:date(\'' + element.value + '\')'
        } else {
          return null
        }
      }
    }

    filter.value = getValue(element)

    if (eventName) {
      element[eventName] = function (event) {
        filter.value = getValue(element)

        app.events.filterChange.trigger()
      }
    }

    return filter
  })

  app.events.filterChange.trigger()
}

app.removeFilter = function (element) {
  element.parentNode.removeChild(element)
  app.updateFilters()
}

app.addFilter = function (label, operator, predicate, value, options) {
  if (arguments.length === 1) {
    var element = arguments[0]

    label = element.textContent
    operator = element.getAttribute('data-filterable')
    predicate = element.getAttribute('data-predicate')
    value = element.value || element.getAttribute('data-value')
    options = {
      namedNode: element.getAttribute('data-named-node') !== null
    }

    return app.addFilter(label, operator, predicate, value, options)
  }

  options = options || {}

  var html = '<div data-filter="' + operator + '" ' +
    (options.inverse ? 'data-inverse ' : '') +
    'data-predicate="' + predicate + '" ' +
    'data-value="' + value + '" ' +
    (options.namedNode ? 'data-named-node ' : '') +
    'class="filter-item" onclick="app.removeFilter(this)">' + label + '</div>'

  document.getElementById(app.options.filterContainer).innerHTML += html

  app.updateFilters()
}

function initUi () {
  // query field
  document.getElementById('query').onkeyup = debounce(function () {
    app.events.search.trigger()
  }, 250)

  app.updateFilters()

  app.events.search.trigger()
}

function initQueryBuilder () {
  app.queryBuilder = new QueryBuilder()

  return Promise.all([
    fetch('zack.sparql').then(function (res) {
      return res.text()
    }),
    fetch('zack.count.sparql').then(function (res) {
      return res.text()
    })
  ]).spread(function (search, count) {
    app.queryTemplates = {
      search: search,
      count: count
    }
  })
}

function initZack () {
  app.zack = new Zack({
    endpointUrl: app.options.endpointUrl,
    pageSize: app.options.pageSize,
    preload: app.options.preload,
    dummyResult: '<div class="zack-result"></div>',
    resultType: 'http://data.archiveshub.ac.uk/def/ArchivalResource',
    renderResult: renderer.renderResult,
    onFetched: app.events.fetched.trigger,
    onFetching: app.events.fetching.trigger,
    onLoadedResultLength: app.events.loadedResultLength.trigger
  })

  // replace default filter query builder methods
  app.zack.buildCountFilterQuery = app.queryBuilder.createBuilder(app.queryTemplates.count)
  app.zack.buildSearchFilterQuery = app.queryBuilder.createBuilder(app.queryTemplates.search)

  // connect events

  app.events.fetched.on(function () {
    console.log('fetched')
    app.isFetching = false
  })

  app.events.fetching.on(function () {
    console.log('fetching')
    app.isFetching = true
  })

  app.events.filterChange.on(function () {
    app.queryBuilder.setFilters(app.filters)
    app.events.search.trigger()
  })

  app.events.loadedResultLength.on(loadedResultLength)

  app.events.search.on(search)
}

initQueryBuilder().then(function () {
  return initZack()
}).then(function () {
  return initUi()
})
