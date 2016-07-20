var inherits = require('inherits')
var Clusterize = require('clusterize.js')
var debounce = require('debounce')

function ClusterizePaging (options) {
  options = options || {}
  options.callbacks = options.callbacks || {}
  options.callbacks.scrollingProgress = this.handleScrollProgress.bind(this)

  Clusterize.call(this, options)

  // merge additional options
  this.options.dummyRow = options.dummyRow
  this.options.preload = options.preload
  this.options.pageSize = options.pageSize
}

inherits(ClusterizePaging, Clusterize)

ClusterizePaging.prototype.init = function (length) {
  this.rows = []

  for (var i = 0; i < length; i++) {
    this.rows.push(this.options.dummyRow)
  }

  this.loading = new Array(Math.ceil(this.rows.length / this.options.pageSize))

  return this.loadRows(0)
}

ClusterizePaging.prototype.handleScrollProgress = debounce(function (percentage) {
  var offset = Math.floor(percentage * this.rows.length / 100)

  this.loadRows(offset)
}, 100)

ClusterizePaging.prototype.loadRows = function (offset, end) {
  var self = this

  end = end || (offset + this.options.preload)

  // load all
  if (end < offset) {
    end = this.rows.length
  }

  var lastLoaded =  this.rows.slice(offset, end).reduce(function (lastLoaded, row, index) {
    if (row !== self.options.dummyRow) {
      return Math.max(lastLoaded, index + offset)
    }

    return lastLoaded
  }, -1)

  if (lastLoaded !== -1) {
    offset = lastLoaded
  }

  if (offset >= end) {
    return Promise.resolve()
  }

  var page = Math.floor(offset / this.options.pageSize)

  offset = page * this.options.pageSize

  // check if the current page is already loading
  if (this.loading[page]) {
    return Promise.resolve()
  }

  this.loading[page] = true

  return Promise.resolve().then(function () {
    return self.options.callbacks.loadRows(self.rows, offset)
  }).then(function (rows) {
    self.rows = rows
    self.update(self.rows)

    console.log('fetched: ' + offset + '(' + end + ')')

    offset += self.options.pageSize

    // load more results?
    if (offset < end) {
      return self.loadRows(offset, end)
    }
  })
}

module.exports = ClusterizePaging
