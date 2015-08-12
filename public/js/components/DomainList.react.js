var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var DomainsStore = require('../stores/DomainsStore');
var DomainListEntry = require('./DomainListEntry.react');

var DomainList = React.createClass({
  getInitialState: function() {
    return {
        domains: []
    }
  },

  componentWillMount: function() {
    VegaDNSActions.listDomains();
  },

  componentDidMount: function() {
    DomainsStore.addChangeListener(this.onChange);
  },

  componentWillUnmount: function() {
    DomainsStore.removeChangeListener(this.onChange);
  },

  onChange() {
    this.setState({domains: DomainsStore.getDomainList()});
  },

  render: function() {
      var domains = [];

      for (var key in this.state.domains) {
        domains.push(<DomainListEntry key={key} domain={this.state.domains[key]} />);
      }

      return (
          <section id="domains">
            <h1>Domains</h1>
            <table className="table table-hover">
                <thead>
                    <th>id</th>
                    <th>name</th>
                    <th>status</th>
                </thead>
                <tbody>
                    {domains}
                </tbody>
            </table>
          </section>
      );
  }
});

module.exports = DomainList;
