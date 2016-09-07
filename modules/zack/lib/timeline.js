var d3 = require('d3')

function Timeline () {}

Timeline.prototype.render = function (start, end) {
  var eleWidth = document.getElementById('zack-timeline').offsetWidth

  var margin = {top: 0, right: 20, bottom: 0, left: 20}
  var width = eleWidth - margin.left - margin.right
  var height = 50 - margin.top - margin.bottom

  if (d3.select('#timeline-container').empty()) {
    d3.select('#zack-timeline').append('svg')
        .attr('id', 'timeline-container')
        .append('g')
        .attr('id', 'timeline')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .append('g')
        .attr('id', 'timeline-axis')
  }

  var x = d3.scaleUtc()
    .domain([start, end])
    .range([0, width])

  var xAxis = d3.axisBottom()
    .scale(x)
    .tickFormat(d3.timeFormat('%Y'))
    .tickValues(
        [start, end].concat( // add the first and last year
            d3.scaleUtc().domain(x.domain()) // use UTC domain
              .ticks(Math.floor(width / 50)) // get ticks roughly 50px appart
              .slice(0, -1) // remove the first and last tick
        )
    )

  d3.select('#timeline-container')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

  d3.select('#timeline-axis')
//    .transition()
//    .duration(400)
    .call(xAxis)
}

module.exports = Timeline
