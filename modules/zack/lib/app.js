var Promise = require('bluebird')
var debounce = require('debounce')
var fetch = require('isomorphic-fetch')
var renderer = require('./renderer')
var Event = require('crab-event').Event
var Zack = require('./zack')

var app = {}

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

Promise.all([
  fetch('zack.sparql').then(function (res) {
    return res.text()
  }),
  fetch('zack.count.sparql').then(function (res) {
    return res.text()
  })
]).spread(function (searchSparql, countSparql, matcher) {
  app.zack = new Zack({
    endpointUrl: 'http://data.admin.ch:3030/alod/query',
    searchSparql: searchSparql,
    countSparql: countSparql,
    pageSize: 20,
    preload: 80,
    dummyResult: '<div class="zack-result"></div>',
    resultType: 'http://data.archiveshub.ac.uk/def/ArchivalResource',
    renderResult: renderer.renderResult,
    onLoadedResultLength: app.events.loadedResultLength.trigger
  })

  app.events.search.on(search)
  app.events.loadedResultLength.on(loadedResultLength)

  document.getElementById('query').onkeyup = debounce(function () {
    app.events.search.trigger()
  }, 250)

  app.events.search.trigger()
})

