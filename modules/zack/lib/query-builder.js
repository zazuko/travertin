var Promise = require('bluebird')
var clone = require('lodash/clone')
var fetch = require('isomorphic-fetch')

function QueryBuilder (filters) {
  this.setFilters(filters || [])
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

QueryBuilder.prototype.setFilters = function (filters) {
  this.filters = QueryBuilder.compactFilters(filters)
}

QueryBuilder.prototype.attach = function (zack) {
  this.zack = zack

  zack.buildCountQuery = this.buildCountQuery.bind(this)
  zack.buildSearchQuery = this.buildSearchQuery.bind(this)
}

QueryBuilder.prototype.buildFilters = function () {
  var ind = '      '

  if (this.filters.length === 0) {
    return ''
  }

  var sparql = this.filters.map(function (filter) {
    if (filter.operator === '=') {
      if (!filter.inverse) {
        return ind + '?sub <' + filter.predicate + '> ' + filter.value + ' .'
      } else {
        return ind + filter.value + ' <' + filter.predicate + '>  ?sub .'
      }
    } else if (filter.operator === 'IN') {
      var value = '(' + filter.value.join(', ') + ')'

      return ind + '?sub <' + filter.predicate + '> ?' + filter.variable + ' .\n' +
        ind + 'FILTER (?' + filter.variable + ' ' + filter.operator + ' ' + value + ')'
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

QueryBuilder.compactFilters = function (filters) {
  // remove empty filters
  filters = filters.filter(function (filter) {
    return filter.value
  })

  // merge = filters with the same predicate to IN filter
  filters = filters.reduce(function (filters, filter) {
    var existing = filters.filter(function (existing) {
      return filter.operator === '=' &&
        (existing.operator === '=' || existing.operator === 'IN') &&
        existing.predicate === filter.predicate
    }).shift()

    if (existing) {
      if (Array.isArray(existing.value)) {
        existing.value.push(filter.value)
      } else {
        // clone and replace filter so we don't touch the original
        var inFilter = clone(existing)

        inFilter.operator = 'IN'
        inFilter.value = [existing.value, filter.value]

        filters.splice(filters.indexOf(existing), 1, inFilter)
      }
    } else {
      filters.push(filter)
    }

    return filters
  }, [])

  return filters
}

module.exports = QueryBuilder
