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

QueryBuilder.prototype.buildFilters = function () {
  const IND = '      '
  var filters = ''

  if (this.filters.level) {
    filters += IND + '?sub <http://data.archiveshub.ac.uk/def/level> <' + this.filters.level + '> .\n'
  }

  if (this.filters.to) {
    filters += IND +'?sub <http://www.w3.org/2006/time#intervalEnds> ?end.\n' +
               IND + 'FILTER (?end <= xsd:date(\''+this.filters.to.toISOString().slice(0,10)+'\'))\n'
  }

  if (this.filters.from) {
    filters += IND + '?sub <http://www.w3.org/2006/time#intervalStarts> ?start.\n' +
               IND + 'FILTER (?start >= xsd:date(\''+this.filters.from.toISOString().slice(0,10)+'\'))\n'
  }

  if (filters) {
    filters = '\n    GRAPH ?g {\n' + filters + '    \n    }'
  }
  return filters
}

QueryBuilder.prototype.buildCountQuery = function () {
  return this.countQueryTemplate.replace(/\${searchString}/g, this.zack.query).replace(/\${filters}/g, this.buildFilters())
}

QueryBuilder.prototype.buildSearchQuery = function (offset) {
  return this.searchQueryTemplate
    .replace(/\${searchString}/g, this.zack.query)
    .replace(/\${filters}/g, this.buildFilters())
    .replace(/\${offset}/g, offset)
    .replace(/\${limit}/g, this.zack.options.pageSize)
}

module.exports = QueryBuilder
