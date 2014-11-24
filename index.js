'use strict';

var
  express = require('express'),
  expressUtils = require('express-utils'),
  morgan = require('morgan'),
  config = require('./config.js'),
  handlerMiddleware = require('./lib/handler-middleware'),
  patchHeaderMiddleware = require('./lib/patch-header-middleware');


var
  app = express(),
  handler = new config.HandlerClass(config.handlerOptions);

app.use(morgan('combined'));
app.use(expressUtils.absoluteUrl());
app.use(patchHeaderMiddleware({accept: 'text/turtle'}));
app.use(handlerMiddleware(handler));

app.listen(config.listener.port);