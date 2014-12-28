'use strict';

var
  fs = require('fs'),
  path = require('path'),
  streamBuffers = require("stream-buffers");


require('express-negotiate');


module.exports = function (handler) {
  var
    template = fs.readFileSync(path.join(__dirname, '../data/public/index.html')).toString();

  return function (req, res, next) {
    req.negotiate({
      'html': function() {
        if (req.method === 'GET') {
          // emulate http response to fetch content from handler
          var ldContentBuffer = new streamBuffers.WritableStreamBuffer();

          ldContentBuffer.setHeader = function () {};
          ldContentBuffer.writeHead = function (statusCode) { this.statusCode = statusCode; };

          var notFound = function () {
            res.writeHead(404);
            res.end();
          };

          var done = function () {
            if (ldContentBuffer.statusCode === 404) {
              notFound();
            } else {
              // we have already the content, so let's inject it to avoid another round trip
              var body = template.replace('%graph%', ldContentBuffer.getContents().toString());

              res.writeHead(200, {
                'Content-Length': body.length,
                'Content-Type': 'text/html'
              });
              res.end(body);
            }
          };

          ldContentBuffer.on('close', done);

          handler.get({headers: {accept: 'application/ld+json'}}, ldContentBuffer, notFound, req.absoluteUrl())
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