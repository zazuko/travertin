'use strict';

var
  express = require('express'),
  expressUtils = require('express-utils'),
  config = require('./config.js'),
  handlerMiddleware = require('./lib/handler-middleware');


var
  app = express(),
  handler = new config.HandlerClass(config.handlerOptions);

app.use(expressUtils.absoluteUrl());
app.use(handlerMiddleware(handler));

app.listen(config.listener.port);