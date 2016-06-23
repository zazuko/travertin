var inherits = require('inherits')
var Clusterize = require('clusterize.js')

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

  return this.loadRows(0)
}

ClusterizePaging.prototype.handleScrollProgress = function (percentage) {
  var offset = Math.floor(percentage * this.rows.length / 100)

  this.loadRows(offset)
}

ClusterizePaging.prototype.loadRows = function (offset, end) {
  var self = this

  end = end || (offset + this.options.preload)

  // load all
  if (end < offset) {
    end = this.rows.length
  }

  var lastLoaded = this.rows.slice(offset).reduce(function (lastLoaded, row, index) {
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

  return Promise.resolve().then(function () {
    return self.options.callbacks.loadRows(self.rows, offset)
  }).then(function (rows) {
    self.rows = rows
    self.update(self.rows)

    // init page size options if not given
    if (!self.options.pageSize) {
      self.options.pageSize = rows.filter(function (row) {
        return row !== self.options.dummyRow
      }).length
    }

    console.log('fetched: ' + offset + '(' + end + ')')

    offset += self.options.pageSize

    // load more results?
    if (offset < end) {
      return self.loadRows(offset, end)
    }
  })
}

module.exports = ClusterizePaging
