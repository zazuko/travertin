/* global log:false */

'use strict';

var
  fs = require('fs'),
  path = require('path'),
  streamBuffers = require("stream-buffers");


require('express-negotiate');


module.exports = function (handler) {
  var templates = [
    { // this is also the default template
      id: 'BAR',
      regex: new RegExp('http[s]?\://data\.admin\.ch/'),
      template: fs.readFileSync(path.join(__dirname, '../data/templates/bar.html')).toString()
    }, {
      id: 'BS',
      regex: new RegExp('http[s]?\://data\.staatsarchiv\.bs\.ch/'),
      template: fs.readFileSync(path.join(__dirname, '../data/templates/bs.html')).toString()
    }, {
      id: 'GE',
      regex: new RegExp('http[s]?\://data\.ge\.ch/'),
      template: fs.readFileSync(path.join(__dirname, '../data/templates/ge.html')).toString()
    }, {
      id: 'NE',
      regex: new RegExp('http[s]?\://data\.ne\.ch/'),
      template: fs.readFileSync(path.join(__dirname, '../data/templates/ne.html')).toString()
    }, {
      id: 'VS',
      regex: new RegExp('http[s]?\://data\.levalais\.ch/'),
      template: fs.readFileSync(path.join(__dirname, '../data/templates/vs.html')).toString()
    }
  ];

  var handlerGetRequest = function (iri, mimetype) {
    return new Promise(function (resolve, reject) {
      var contentBuffer = new streamBuffers.WritableStreamBuffer();

      contentBuffer.setHeader = function () {};
      contentBuffer.writeHead = function (statusCode) { this.statusCode = statusCode; };

      contentBuffer.on('close', function () {
        if (contentBuffer.statusCode === 404) {
          resolve(null);
        } else {
          resolve(contentBuffer.getContents().toString());
        }
      });

      contentBuffer.on('error', function () {
        reject();
      });

      handler.get(
        {headers: {accept: mimetype}},
        contentBuffer,
        function () { resolve(null); },
        iri);
    });
  };

  var getTemplate = function (iri) {
    for (var i=0; i<templates.length; i++) {
      if (templates[i].regex.test(iri)) {
        log.debug({script: __filename}, 'using ' + templates[i].id + 'template');

        return templates[i].template;
      }
    }

    log.debug({script: __filename}, 'using default template ' + templates[0].id);

    return templates[0].template;
  };

  return function (req, res, next) {
    req.negotiate({
      'html': function() {
        var
          iri = req.absoluteUrl();

        if (req.method === 'GET') {
          log.info({script: __filename}, 'handle GET request for IRI <' + iri + '>');

          handlerGetRequest(iri, 'application/ld+json')
            .then(function (content) {
              if (content == null || Object.keys(JSON.parse(content)).length === 0) {
                res.writeHead(404);
                res.end();
              } else {
                // we have already the content, so let's inject it to avoid another round trip
                var body = getTemplate(iri).replace('%graph%', content);

                res.writeHead(200, {
                  'Content-Length': body.length,
                  'Content-Type': 'text/html'
                });
                res.end(body);
              }
            })
            .catch(function () {
              res.writeHead(500);
              res.end();
            });
        } else {
          next();
        }
      },
      'default': function () {
        next();
      }
    });
  };
};