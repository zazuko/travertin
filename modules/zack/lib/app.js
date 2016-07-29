var debounce = require('debounce')
var renderer = require('./renderer')
var Event = require('crab-event').Event
var QueryBuilder = require('./query-builder')
var Zack = require('./zack')

var app = {}

window.app = app

app.options = {
  endpointUrl: 'http://data.admin.ch:3030/alod/query',
  pageSize: 20,
  preload: 80
}

app.events = {
  filterChange: new Event(),
  loadedResultLength: new Event(),
  search: new Event(),
  updateFilters: new Event()
}

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

function updateFilters () {
  var elements = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'))

  app.filters = elements.filter(function (element) {
    return element.getAttribute('disabled') === null
  }).map(function (element, index) {
    var filter = {}

    filter.operator = element.getAttribute('data-filter')
    filter.predicate = element.getAttribute('data-predicate')
    filter.termType = element.getAttribute('data-term-type') || 'Literal'
    filter.variable = 'filter' + index

    var eventName = 'onchange'
    var getValue = function (element) {
      return element.value || element.getAttribute('data-value')
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

function initUi () {
  // query field
  document.getElementById('query').onkeyup = debounce(function () {
    app.events.search.trigger()
  }, 250)
}

var queryBuilder = new QueryBuilder()

queryBuilder.init().then(function () {
  app.zack = new Zack({
    endpointUrl: app.options.endpointUrl,
    pageSize: app.options.pageSize,
    preload: app.options.preload,
    dummyResult: '<div class="zack-result"></div>',
    resultType: 'http://data.archiveshub.ac.uk/def/ArchivalResource',
    renderResult: renderer.renderResult,
    onLoadedResultLength: app.events.loadedResultLength.trigger
  })

  queryBuilder.attach(app.zack)

  app.events.search.on(search)
  app.events.loadedResultLength.on(loadedResultLength)
  app.events.updateFilters.on(updateFilters)
  app.events.filterChange.on(function () {
    queryBuilder.filters = app.filters
    app.events.search.trigger()
  })

  initUi()
  updateFilters()

  app.events.search.trigger()
})
