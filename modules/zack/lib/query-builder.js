var Promise = require('bluebird')
var fetch = require('isomorphic-fetch')

function QueryBuilder (filters) {
  this.filters = filters || []
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
  var ind = '      '

  var filters = this.filters.filter(function (filter) {
    return filter.value
  })

  if (filters.length === 0) {
    return ''
  }

  var sparql = filters.map(function (filter) {
    if (filter.operator === '=') {
      if (filter.termType === 'NamedNode') {
        return ind + '?sub <' + filter.predicate + '> <' + filter.value + '> .\n'
      }
    } else {
      return ind + '?sub <' + filter.predicate + '> ?' + filter.variable + ' .\n' +
        ind + 'FILTER (?' + filter.variable + ' ' + filter.operator + ' ' + filter.value + ')'
    }
  }).join('\n')

  sparql = '\n    GRAPH ?g {\n' + sparql + '    \n    }'

  return sparql
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
