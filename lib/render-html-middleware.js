'use strict';

var
  fs = require('fs'),
  path = require('path'),
  streamBuffers = require("stream-buffers");


require('express-negotiate');


module.exports = function (handler) {
  var
    template = fs.readFileSync(path.join(__dirname, '../data/public/index.html')).toString();

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

  return function (req, res, next) {
    req.negotiate({
      'html': function() {
        if (req.method === 'GET') {
          handlerGetRequest(req.absoluteUrl(), 'application/ld+json')
            .then(function (content) {
              if (content == null) {
                res.writeHead(404);
                res.end();
              } else {
                // we have already the content, so let's inject it to avoid another round trip
                var body = template.replace('%graph%', content);

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