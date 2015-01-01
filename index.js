'use strict';

global.Promise = require('es6-promise').Promise;

var
  config = require('./config.js'),
  express = require('express'),
  expressUtils = require('express-utils'),
  handlerMiddleware = require('./lib/handler-middleware'),
  morgan = require('morgan'),
  path = require('path'),
  bunyan  = require('bunyan'),
  renderHtmlMiddleware = require('./lib/render-html-middleware');


global.log  = bunyan.createLogger({
  name: config.app,
  level: config.logger.level
});


if (!('init' in config)) {
  config.init = function () { return Promise.resolve(); };
}

config.init()
  .then(function () {
    var
      app = express(),
      handler = new config.HandlerClass(config.handlerOptions);

    if ('expressSettings' in config) {
      for (var key in config.expressSettings) {
        app.set(key, config.expressSettings[key]);
      }
    }

    app.use(morgan('combined'));
    app.use(express.static(path.join(__dirname, './data/public/')));
    app.use(expressUtils.absoluteUrl());
    app.use(renderHtmlMiddleware(handler));
    app.use(handlerMiddleware(handler));
    app.listen(config.listener.port);

    log.info('listening on port: ' + config.listener.port);
  });
