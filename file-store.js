/* global rdf:true */
'use strict';

var
  fs = require('fs'),
  path = require('path'),
  url = require('url');


var AbstractStore = function () {
  var self = this;

  this.match = function (iri, subject, predicate, object, callback, limit) {
    self.graph(iri, function (graph) {
      if (graph == null) {
        callback(null);
      } else {
        callback(graph.match(subject, predicate, object, limit));
      }
    });
  };

  this.merge = function (iri, graph, callback) {
    self.graph(iri, function (existing) {
      var merged = graph;

      if (existing != null) {
        merged = existing.addAll(graph);
      }

      self.add(merged, callback);
    });
  };

  this.remove = function (iri, graph, callback) {
    self.graph(iri, function (existing) {
      if (existing != null) {
        self.add(rdf.Graph.difference(existing, graph), function (added) {
          callback(added != null);
        });
      } else {
        callback(true);
      }
    });
  };

  this.removeMatches = function (iri, subject, predicate, object, callback) {
    self.graph(iri, function (existing) {
      if (existing != null) {
        self.add(iri, existing.removeMatches(subject, predicate, object), function (added) {
          callback(added != null);
        });
      } else {
        callback(true);
      }
    });
  };
};


var FileStore = function (rdf, options) {
  if (options == null) {
    options = {};
  }

  var self = this;

  this.parse = 'parser' in options ? options.parse : rdf.parseTurtle;
  this.serialize = 'serialize' in options ? options.serialize : rdf.serializeNTriples;
  this.path = 'path' in options ? options.path : '.';
  this.graphFile = 'graphFile' in options ? options.graphFile : function (p) {
    return p.pathname.split('/').slice(1).join('_') + '.ttl';
  };

  var graphPath = function (iri) {
    var parsed = url.parse(iri);

    return path.join(self.path, self.graphFile(parsed));
  };

  var graphExists = function (iri) {
    return fs.existsSync(graphPath(iri));
  };

  this.graph = function (iri, callback) {
    if (!graphExists(iri)) {
      return callback(null);
    }

    self.parse(
      fs.readFileSync(graphPath(iri)).toString(),
      callback,
      iri);
  };

  this.add = function (iri, graph, callback) {
    self.serialize(
      graph,
      function (serialized) {
        fs.writeFileSync(graphPath(iri), serialized);

        callback(graph);
      }, iri);
  };

  this.delete = function (iri, callback) {
    if (graphExists(iri)) {
      fs.unlink(graphPath(iri));
    }

    callback(true);
  };
};

FileStore.prototype = new AbstractStore();


module.exports = function (rdf) {
  rdf.FileStore = FileStore.bind(null, rdf);
};

module.exports.store = FileStore;