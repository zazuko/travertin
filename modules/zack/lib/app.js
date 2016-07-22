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
  dateFromChange: new Event(),
  dateToChange: new Event(),
  levelChange: new Event(),
  loadedResultLength: new Event(),
  search: new Event()
}

app.filters = {
  from: null,
  level: null,
  to: null
}

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

function initUi () {
  // query field
  document.getElementById('query').onkeyup = debounce(function () {
    app.events.search.trigger()
  }, 250)

  // level dropdown
  document.getElementById('level-filter').onchange = function (event) {
    app.events.levelChange.trigger(event.target.value)
  }

  // date from input
  document.getElementById('from').onblur = function (event) {
    var value = null

    if (event.target.value) {
      value = new Date(event.target.value)
    }

    app.events.dateFromChange.trigger(value)
  }

  // date to input
  document.getElementById('to').onblur = function (event) {
    var value = null

    if (event.target.value) {
      value = new Date(event.target.value)
    }

    app.events.dateToChange.trigger(value)
  }
}

var queryBuilder = new QueryBuilder(app.filters)

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

  // level filter
  app.events.levelChange.on(function (level) {
    app.filters.level = level
  })
  app.events.levelChange.on(app.events.search.trigger)

  // date from filter
  app.events.dateFromChange.on(function (date) {
    app.filters.from = date
  })
  app.events.dateFromChange.on(app.events.search.trigger)

  // date to filter
  app.events.dateToChange.on(function (date) {
    app.filters.to = date
  })
  app.events.dateToChange.on(app.events.search.trigger)

  initUi()

  app.events.search.trigger()
})
