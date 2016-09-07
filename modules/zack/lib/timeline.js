var d3 = require('d3')

function Timeline () {
  this.margin = {top: 0, right: 20, bottom: 0, left: 20}

  this.timelineWidth = document.getElementById('zack-timeline').offsetWidth
  this.width = this.timelineWidth - this.margin.left - this.margin.right
  this.height = 50 - this.margin.top - this.margin.bottom

  d3.select('#zack-timeline').append('svg')
        .attr('id', 'timeline-container')
        .append('g')
        .attr('id', 'timeline')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
        .append('g')
        .attr('id', 'timeline-axis')
}

Timeline.prototype.render = function (start, end) {
  this.timelineWidth = document.getElementById('zack-timeline').offsetWidth
  this.width = this.timelineWidth - this.margin.left - this.margin.right

  var x = d3.scaleUtc()
    .domain([start, end])
    .range([0, this.width])

  var xAxis = d3.axisBottom()
    .scale(x)
    .tickFormat(d3.timeFormat('%Y'))
    .tickValues(
        [start, end].concat( // add the first and last year
            d3.scaleUtc().domain(x.domain()) // use UTC domain
              .ticks(Math.floor(this.width / 50)) // get ticks roughly 50px appart
              .slice(0, -1) // remove the first and last tick
        )
    )

  d3.select('#timeline-container')
    .attr('width', this.width + this.margin.left + this.margin.right)
    .attr('height', this.height + this.margin.top + this.margin.bottom)

  d3.select('#timeline-axis')
//    .transition()
//    .duration(400)
    .call(xAxis)
}

module.exports = Timeline
