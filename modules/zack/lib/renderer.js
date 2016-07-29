var colorHash = new (require('color-hash'))

var renderer = {}

renderer.renderResult = function (page, subject) {
  var rendering = ''

  var level = page.match(subject, 'http://data.archiveshub.ac.uk/def/level').toArray().shift()

  var levelString = level.toString()
  var levelShort = levelString.substring(levelString.lastIndexOf('/') + 1, levelString.length - 3)
  var levelColor = colorHash.hex(levelShort)

  var title = page.match(subject, 'http://purl.org/dc/elements/1.1/title').toArray().shift()

  var titleString = '<a href="' + subject.toString() + '">' + title.object.toString() + '</a>'

  var referenceCode = page.match(subject, 'http://data.alod.ch/alod/referenceCode').toArray().shift()
  var recordId = page.match(subject, 'http://data.alod.ch/alod/recordID').toArray().shift()


  var referenceString = recordId.object.toString()
  if (referenceCode) {
    referenceString = referenceCode.object.toString()
  }
  var reference = '<i>' + referenceString + '</i>'

  var maintenanceAgencyCode = page.match(subject, 'http://data.archiveshub.ac.uk/def/maintenanceAgencyCode').toArray().shift()
  var agency = ''
  if (maintenanceAgencyCode) {
      maintenanceAgency = '<div data-filterable="=" data-predicate="' + maintenanceAgencyCode.predicate.toString() + '" ' +
        ' data-value="' + maintenanceAgencyCode.object.toString() + '" ' +
        ' class="filterable" onclick="app.addFilter(this)">' + maintenanceAgencyCode.object.toString() + '</div>'
  }

  var intervalStarts = page.match(subject, 'http://www.w3.org/2006/time#intervalStarts').toArray().shift()

  var timeTick = ''
  if (intervalStarts) {
    var year = parseInt(intervalStarts.object.toString().substring(0, 4))
    if (!isNaN(year)) {
      var percent = (year - 1700) / 3
      timeTick = '<div style="left: ' + percent + '%;" class="result-time-tick"></div>'
    }
  }

  rendering =  '<div class="zack-result row"><div class="one-third column"><div class="result-level-wrap"><div class="vertical-text result-level" style="background-color: ' + levelColor + '">' + levelShort + '</div></div>' + '<div class="result-main">' + timeTick + titleString + '</br>' + reference + '</div></div><div class="two-thirds column">'+maintenanceAgency+'</div></div>'

   return rendering
}

module.exports = renderer
