'use strict';

global.Promise = require('es6-promise').Promise;

var
  config = require('./config.js'),
  express = require('express'),
  expressUtils = require('express-utils'),
  handlerMiddleware = require('./lib/handler-middleware'),
  morgan = require('morgan'),
  path = require('path'),
  renderHtmlMiddleware = require('./lib/render-html-middleware');


if (!('init' in config)) {
  config.init = Promise.resolve;
}

config.init()
  .then(function () {
    var
      app = express(),
      handler = new config.HandlerClass(config.handlerOptions);

    app.use(morgan('combined'));
    app.use(express.static(path.join(__dirname, './data/public/')));
    app.use(expressUtils.absoluteUrl());
    app.use(renderHtmlMiddleware(handler));
    app.use(handlerMiddleware(handler));
    app.listen(config.listener.port);

    console.log('listening on port: ' + config.listener.port);
  });