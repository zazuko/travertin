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
  "alod" : "http://data.alod.ch/alod/",
  "ne" : "http://localhost:3030/alod/ne",
  "locah" : "http://data.archiveshub.ac.uk/def/",
  "owl" : "http://www.w3.org/2002/07/owl#",
  "rdf" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  "bar" : "http://localhost:3030/alod/bar",
  "skos" : "http://www.w3.org/2004/02/skos/core#"
};


var ResultTable = React.createClass({
  getInitialState: function() {
    return {
      data: [{title: 'test'}]
    }
  },
  loadData: function() {
    var
      self = this,
      searchString = $('#search-string').val();

    $.ajax({
      url: '/alod/search?q=' + encodeURIComponent(searchString),
      headers: {Accept: 'application/ld+json'},
      success: function(data) {
        jsonld.promises().compact(data, context)
          .then(function (data) {
            if ('@graph' in data) {
              data = data['@graph'];
            } else {
              data = [data];
            }

            self.setState({data: data});
          })
          .catch(function (error) {
            console.error(error.stack);
          });
      }
    })
  },
  componentDidMount: function() {
    var self = this;

    $('#search').on('click', self.loadData);
  },
  componentDidUpdate: function() {
    var self = this;

    $('#search').off('click', self.loadData);
  },
  render: function() {
    var self = this;

    var rows = self.state.data.map(function (row, index) {
      return React.DOM.tr({},
        React.DOM.td({}, index + 1),
        React.DOM.td({}, row.title));
    });

    return React.DOM.div({className: 'table-responsive'},
    React.DOM.table({className: 'table table-bordered', id: 'results-table'},
      React.DOM.thead({},
        React.DOM.tr({},
          React.DOM.th({}, 'row'),
          React.DOM.th({}, 'title')
        )
      ),
      React.DOM.tbody({}, rows)
    )
    );
  }
});

var createResultTable = React.createFactory(ResultTable);


var results = createResultTable({id: 'results'});

React.render(results, document.getElementById('results'));
