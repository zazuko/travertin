var context = {
  "level" : "http://localhost:3030/alod/level",
  "title" : "http://purl.org/dc/elements/1.1/title",
  "dc" : "http://purl.org/dc/elements/1.1/",
  "prov" : "http://www.w3.org/ns/prov#",
  "foaf" : "http://xmlns.com/foaf/0.1/",
  "ge" : "http://localhost:3030/alod/ge",
  "bs" : "http://localhost:3030/alod/bs",
  "rdfs" : "http://www.w3.org/2000/01/rdf-schema#",
  "time" : "http://www.w3.org/2006/time#",
  "ne" : "http://localhost:3030/alod/ne",
  "locah" : "http://data.archiveshub.ac.uk/def/",
  "owl" : "http://www.w3.org/2002/07/owl#",
  "rdf" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  "bar" : "http://localhost:3030/alod/bar",
  "skos" : "http://www.w3.org/2004/02/skos/core#",
  "recordID": "http://data.alod.ch/alod/recordID"
};


var ResultTable = React.createClass({
  getInitialState: function() {
    return {
      page: 0,
      cache: {},
      details: {},
      data: []
    }
  },
  search: function () {
    var self = this;

    self.setState({cache: {}, data: []});

    self.setPage(0);
  },
  setPage: function (page) {
    var self = this;

    self.loadResults(page)
      .then(function (results) {
        self.setState({page: page, data: results});

        self.updateCache();
        self.updateDetails();
      })
      .catch(function () {
        self.setState({page: page, data: []});
      });
  },
  turnPage: function (direction, event) {
    var self = this;

    if (event != null) {
      event.preventDefault();
    }

    if (self.state.page + direction >= 0) {
      self.setPage(self.state.page + direction);
    }
  },
  updateCache: function () {
    var self = this;

    if (self.state.page > 0) {
      self.loadResults(self.state.page-1);
    }

    self.loadResults(self.state.page+1);
  },
  updateDetails: function () {
    var self = this;

    return Promise.all(self.state.data.map(function (row) {
      return self.loadDetails(row['@id']);
    }))
      .then(function (allDetails) {
        return Promise.all(allDetails.map(function (details) {
          if (!('dc:relation' in details)) {
            return Promise.resolve();
          }

          return self.loadDetails(details['dc:relation']['@id']);
        }));
      });
  },
  loadResults: function(page) {
    var
      self = this,
      searchGraph = $('#search-graph').val(),
      searchString = $('#search-string').val();

    var doRequest = function (searchString, searchGraph, page) {
      return new Promise(function (resolve, reject) {
        var url = '/alod/search?q=' + encodeURIComponent(searchString) + '&page=' + (page + 1);

        if (searchGraph != null && searchGraph !== '') {
          url += '&graph=' + encodeURIComponent(searchGraph);
        }

        $.ajax({
          url: url,
          headers: {Accept: 'application/ld+json'},
          success: function (data) {
            jsonld.promises().compact(data, context)
              .then(function (data) {
                var cache = self.state.cache;

                if ('@graph' in data) {
                  data = data['@graph'];
                } else {
                  data = [data];
                }

                cache[page] = data;

                self.setState({cache: cache});

                resolve(data);
              })
          },
          error: function () {
            reject();
          }
        });
      });
    };

    if (page in self.state.cache) {
      return Promise.resolve(self.state.cache[page]);
    } else {
      return doRequest(searchString, searchGraph, page);
    }
  },
  loadDetails: function (url) {
    var self = this;

    var doRequest = function (url) {
      return new Promise(function (resolve, reject) {
        $.ajax({
          url: url,
          headers: {Accept: 'application/ld+json'},
          success: function (data) {
            jsonld.promises().compact(data, context)
              .then(function (data) {
                var details = self.state.details;

                details[url] = data;

                self.setState({details: details});

                resolve(data);
              })
          },
          error: function () {
            reject();
          }
        });
      });
    };

    if (url in self.state.details) {
      return Promise.resolve(self.state.details[url]);
    } else {
      return doRequest(url);
    }
  },
  componentDidMount: function() {
    var self = this;

    $('#search').on('click', self.search);
    $('#search-string').keypress(function (event) {
      if (event.which == 13) {
        self.search();
      }
    });
  },
  componentWillUnmount: function() {
    var self = this;

    $('#search').off('click', self.search);
  },
  render: function() {
    var self = this;

    var value = function (property) {
      if (typeof property === 'string') {
        return property;
      } else if ('@value' in property) {
        return property['@value'];
      } else if ('@id' in property) {
        return property['@id'];
      }
    };

    var getTerm = function (iri) {
      var
        getTermRegEx = /(#|\/)([^#\/]*)$/,
        parts = getTermRegEx.exec(iri);

      if (parts == null || parts.length === 0) {
        return null;
      }

      return parts[parts.length-1];
    };

    var link = function (ref, label) {
      if (ref === '') {
        return '';
      }

      if (label == null) {
        label = getTerm(ref);
      }

      return React.DOM.a({href: ref}, label);
    };


    var detail = function (id, property) {
      if (!(id in self.state.details)) {
        return '';
      }

      var details = self.state.details[id];

      if ('@graph' in details) {
        details = details['@graph'];
      }

      if (Array.isArray(details)) {
        details.forEach(function (subject) {
          if (subject['@id'].indexOf('_:') !== 0) {
            details = subject;
          }
        });
      }

      if (!(property in details)) {
        return '';
      }

      return details[property];
    };

    var rows = self.state.data.map(function (row, index) {
      var
        relation = value(detail(row['@id'], 'dc:relation')),
        relationTitle = value(detail(relation, 'title'));

      return React.DOM.tr({},
        React.DOM.td({}, self.state.page*self.props.resultsPerPage + index + 1),
        React.DOM.td({},
          React.DOM.a({href: row['@id']}, value(row.title))),
        React.DOM.td({}, value(detail(row['@id'], 'time:intervalStarts'))),
        React.DOM.td({}, value(detail(row['@id'], 'time:intervalEnds'))),
        React.DOM.td({}, value(detail(row['@id'], 'locah:note'))),
        React.DOM.td({}, link(value(detail(row['@id'], 'locah:level')))),
        React.DOM.td({}, value(detail(row['@id'], 'recordID'))),
        React.DOM.td({}, link(value(relation), relationTitle))
      );
    });

    var table = React.DOM.table({className: 'table table-bordered', id: 'results-table'},
      React.DOM.thead({},
        React.DOM.tr({},
          React.DOM.th({className: 'col-xs-1'}, 'Nr.'),
          React.DOM.th({className: 'col-xs-4'}, 'Titel'),
          React.DOM.th({className: 'col-xs-1'}, 'von'),
          React.DOM.th({className: 'col-xs-1'}, 'bis'),
          React.DOM.th({className: 'col-xs-1'}, 'Notiz'),
          React.DOM.th({className: 'col-xs-1'}, 'Ebene'),
          React.DOM.th({className: 'col-xs-1'}, 'ID'),
          React.DOM.th({className: 'col-xs-1'}, 'Kategorie')
        )),
      React.DOM.tbody({}, rows));

    var searchString = $('#search-string').val();

    var noEntries = React.DOM.p({}, i18n.t('search.no_hits', { defaultValue: "" }));

    var pageIsNotEmpty = function (page) {
      if (!(page in self.state.cache)) {
        return false;
      }

      // there is at least one context entry
      return self.state.cache[page].length > 1;
    };

    var pager = React.DOM.nav({},
      React.DOM.ul({className: 'pager'},
        pageIsNotEmpty(self.state.page-1) ? React.DOM.li({className: 'previous'},
          React.DOM.a({href: '#', onClick: self.turnPage.bind(self, -1)}, 'Previous')) : null,
        pageIsNotEmpty(self.state.page+1) ? React.DOM.li({className: 'next'},
          React.DOM.a({href: '#', onClick: self.turnPage.bind(self, +1)}, 'Next')) : null));

    return React.DOM.div({},
      self.state.data.length > 0 ? table : searchString != '' ? noEntries : '',
      pager);
  }
});


window.ui = {
  createResultTable: React.createFactory(ResultTable)
};