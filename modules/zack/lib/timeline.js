var d3 = require('d3')

function Timeline () {}

Timeline.prototype.render = function (start, end) {

    var eleWidth = document.getElementById('zack-timeline').offsetWidth

    var margin = {top: 0, right: 20, bottom: 0, left: 20},
        width = eleWidth - margin.left - margin.right,
        height = 50 - margin.top - margin.bottom

    var x = d3.scaleUtc()
        .domain([start, end])
        .range([0, width])

    var xAxis = d3.axisBottom()
        .scale(x)
        .tickFormat(d3.timeFormat('%Y'))
        .tickValues([start,end].concat(d3.scaleUtc().domain(x.domain()).ticks(Math.floor(width/50)).slice(0,-1)))

    document.getElementById("zack-timeline").innerHTML = ""

    var svg = d3.select("#zack-timeline").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


    svg.append("g")
        .attr("class", "axis")
        .call(xAxis)
    }

module.exports = Timeline
