/* global rdf:false, React:false */
'use strict';


var JsonLdTable = React.createClass({
  render: function () {
    var
      self = this,
      head,
      body,
      objectContext,
      rows = [];

    var renderIriBlankNode = function (value) {
      if (value.indexOf('_:') === 0) {
        return React.DOM.p({}, value);
      } else {
        return React.DOM.a({href: value}, value);
      }
    };

    var renderAnyNode = function (value) {
      if (typeof value === 'string') {
        return React.DOM.p({}, value);
      } else if ('@value' in value) {
        if ('@lang' in value) {
          return React.DOM.p({}, value['@value'] + ' @' + value['@lang']);
        } else if ('@type' in value) {
          return React.DOM.p({},
            value['@value'] + ' (',
            React.DOM.a({href: value['@type']}, value['@type']),
            ')');
        } else {
          return React.DOM.p({}, value['@value']);
        }
      } else {
        return renderIriBlankNode(value['@id']);
      }
    };

    head = React.DOM.thead({},
      React.DOM.tr({},
        React.DOM.td({}, 'subject'),
        React.DOM.td({}, 'predicate'),
        React.DOM.td({}, 'object')));

    self.props.graph.forEach(function (subjectContext) {
      var subject = subjectContext['@id'];

      for(var predicate in subjectContext) {
        objectContext = subjectContext[predicate];

        if (predicate.indexOf('@') === 0) {
          if (predicate === '@type') {
            predicate = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';

            objectContext = objectContext.map(function (type) {
              return {'@id': type};
            });
          } else {
            continue;
          }
        }

        objectContext.forEach(function (object) {
          rows.push(React.DOM.tr({},
            React.DOM.td({}, renderIriBlankNode(subject)),
            React.DOM.td({}, renderIriBlankNode(predicate)),
            React.DOM.td({}, renderAnyNode(object))));

        });
      }
    });

    body = React.DOM.tbody({}, rows);

    return React.DOM.table({className: 'table table-bordered'}, head, body);
  }
});

var createJsonLdTable = React.createFactory(JsonLdTable);


var getJsonLdGraph = function () {
  var
    element = document.querySelector('script[type="application/ld+json"]');

  if (element == null) {
    return null;
  }

  return element.innerHTML;
};


jsonld.flatten(JSON.parse(getJsonLdGraph()), function(error, result) {
  if (error != null) {
    return;
  }

  var table = createJsonLdTable({graph: result});

  React.renderComponent(table, document.getElementById('graph'));
});