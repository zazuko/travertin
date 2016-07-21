var Promise = require('bluebird')
var colorHash = new (require('color-hash'))
var debounce = require('debounce')
var fetch = require('isomorphic-fetch')
var Zack = require('./zack')

var app = {}

function rowSubjects (page) {
  return page
    .match(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://data.archiveshub.ac.uk/def/ArchivalResource')
    .map(function (triple) {
      return triple.subject
    })
}

function renderRow (page, subject) {
  var level = page.match(subject, 'http://data.archiveshub.ac.uk/def/level').toArray().shift()

  var levelString = level.toString()
  var levelShort = levelString.substring(levelString.lastIndexOf('/') + 1, levelString.length - 3)
  var levelColor = colorHash.hex(levelShort)

  var title = page.match(subject, 'http://purl.org/dc/elements/1.1/title').toArray().shift()

  var referenceCode = page.match(subject, 'http://data.alod.ch/alod/referenceCode').toArray().shift()
  var recordId = page.match(subject, 'http://data.alod.ch/alod/recordID').toArray().shift()

  var referenceString = recordId.object.toString()
  if (referenceCode) {
    referenceString = referenceCode.object.toString()
  }

  var intervalStarts = page.match(subject, 'http://www.w3.org/2006/time#intervalStarts').toArray().shift()

  var timeTick = ''
  if (intervalStarts) {
    var year = parseInt(intervalStarts.object.toString().substring(0, 4))
    if (!isNaN(year)) {
      var percent = (year - 1700) / 3
      timeTick = '<div style="left: ' + percent + '%;" class="result-time-tick"></div>'
    }
  }

  return '<div class="zack-result"><div class="result-level-wrap"><div class="vertical-text result-level" style="background-color: ' + levelColor + '">' + levelShort + '</div></div>' + '<div class="result-main">' + timeTick + '<a href="' + subject.toString() + '">' + title.object.toString() + '</a></br><i>' + referenceString + '</i></div></div>'
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
    dummyRow: '<div class="zack-result"></div>',
    rowSubjects: rowSubjects,
    renderRow: renderRow,
    onResultLength: function (length) {
      document.getElementById('count').innerHTML = length
      document.getElementById('scrollArea').scrollTop = 0
    }
  })

  document.getElementById('query').onkeyup = debounce(function () {
    search()
  }, 250)

  search()
})

