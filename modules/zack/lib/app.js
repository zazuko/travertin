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
  search: new Event(),
  loadedResultLength: new Event()
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

  document.getElementById('query').onkeyup = debounce(function () {
    app.events.search.trigger()
  }, 250)

  app.events.search.trigger()
})
