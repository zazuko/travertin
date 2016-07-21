var colorHash = new (require('color-hash'))

var renderer = {}

renderer.renderRow = function (page, subject) {
  var level = page.match(subject, 'http://data.archiveshub.ac.uk/def/level').toArray().shift()

  var levelString = level.toString()
  var levelShort = levelString.substring(levelString.lastIndexOf('/') + 1, levelString.length - 3)
  var levelColor = colorHash.hex(levelShort)

  var title = page.match(subject, 'http://purl.org/dc/elements/1.1/title').toArray().shift()

  var referenceCode = page.match(subject, 'http://data.alod.ch/alod/referenceCode').toArray().shift()
  var recordId = page.match(subject, 'http://data.alod.ch/alod/recordID').toArray().shift()

  var referenceString = recordId.object.toString()
  if (referenceCode) {
    referenceString = referenceCode.object.toString()
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

  return '<div class="zack-result"><div class="result-level-wrap"><div class="vertical-text result-level" style="background-color: ' + levelColor + '">' + levelShort + '</div></div>' + '<div class="result-main">' + timeTick + '<a href="' + subject.toString() + '">' + title.object.toString() + '</a></br><i>' + referenceString + '</i></div></div>'
}

module.exports = renderer
