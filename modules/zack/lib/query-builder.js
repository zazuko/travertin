var Promise = require('bluebird')
var fetch = require('isomorphic-fetch')

function QueryBuilder (filters) {
  this.filters = filters
}

QueryBuilder.prototype.init = function () {
  var self = this

  return Promise.all([
    fetch('zack.sparql').then(function (res) {
      return res.text()
    }),
    fetch('zack.count.sparql').then(function (res) {
      return res.text()
    })
  ]).spread(function (searchQueryTemplate, countQueryTemplate) {
    self.searchQueryTemplate = searchQueryTemplate
    self.countQueryTemplate = countQueryTemplate
  })
}

QueryBuilder.prototype.attach = function (zack) {
  this.zack = zack

  zack.buildCountQuery = this.buildCountQuery.bind(this)
  zack.buildSearchQuery = this.buildSearchQuery.bind(this)
}

QueryBuilder.prototype.buildCountQuery = function () {
  console.log(this.filters)

  return this.countQueryTemplate.replace('${searchString}', this.zack.query)
}

QueryBuilder.prototype.buildSearchQuery = function (offset) {
  console.log(this.filters)

  return this.searchQueryTemplate
    .replace('${searchString}', this.zack.query)
    .replace('${offset}', offset)
    .replace('${limit}', this.zack.options.pageSize)
}

module.exports = QueryBuilder
