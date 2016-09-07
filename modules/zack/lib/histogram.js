var isomorphicFetch = require('isomorphic-fetch')
var SparqlClient = require('sparql-http-client')
var d3 = require('d3')

SparqlClient.types.select.operation = SparqlClient.prototype.postQuery

function Histogram (options) {
  this.options = options || {}

  this.margin = this.options.margin || {top: 0, right: 0, bottom: 0, left: 0}
  this.height = this.options.height || 40
  this.client = new SparqlClient({
    fetch: isomorphicFetch,
    endpointUrl: options.endpointUrl,
    updateUrl: options.endpointUrl
  })

  d3.select('#timeline-container')
    .append('g')
    .attr('id', 'histogram')
    .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
}

Histogram.prototype.clear = function () {
  d3.select("#histogram").selectAll(".bar").remove()
}

Histogram.prototype.render = function (searchString, start, end) {
  var query = this.buildQuery()
    .replace(/\${searchString}/g, searchString)
    .replace(/\${width}/g, document.getElementById('timeline-container').width.baseVal.value - this.margin.left - this.margin.right)

  var that = this

  this.client.selectQuery(query).then(function (res) {
    res.json().then(function (histData) {
      data = histData.results.bindings

      var scale = d3.scalePow()
        .exponent(0.5)
        .domain([0, d3.max(data, function(d) {return parseInt(d.histo.value)})])
        .range([0, that.height])

/*      var colorScale = d3.scalePow()
        .exponent(0.5)
        .domain([0, d3.max(data, function(d) {return parseInt(d.histo.value)})])
        .range(["darkblue","steelblue"])
*/


      d3.select("#histogram").selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return d.bucket.value + "px" })
        .attr("width", "1px")
 //       .attr("fill", function(d) { return colorScale(d.histo.value) })
        .attr("y", function(d) { return that.height - scale(d.histo.value) })
        .attr("height", function(d) { return scale(d.histo.value)})
          .append("title")
          .text(function (d) {return that.tooltip(d.histo.value, new Date(d.bucket_start.value), new Date(d.bucket_end.value))})
      })
  })
}

Histogram.prototype.tooltip = function (count, start, end) {
    formatDate = d3.timeFormat("%d.%m.%Y")
    return formatDate(start)+"-"+formatDate(end)+": "+count+" Resources";
}

module.exports = Histogram
