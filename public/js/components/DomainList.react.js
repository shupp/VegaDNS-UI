var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var DomainsStore = require('../stores/DomainsStore');
var DomainListEntry = require('./DomainListEntry.react');
var DomainAddForm = require('./DomainAddForm.react');

var DomainList = React.createClass({
    getInitialState: function() {
        return {
            domains: [],
            showAddForm: false
        }
    },

    showAddDomainForm: function() {
        this.setState({showAddForm: true});
    },

    hideAddDomainForm: function() {
        this.setState({showAddForm: false});
    },

    componentWillMount: function() {
        VegaDNSActions.listDomains();
    },

    componentDidMount: function() {
        DomainsStore.addRefreshChangeListener(this.onRefreshChange);
        DomainsStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        DomainsStore.removeRefreshChangeListener(this.onRefreshChange);
        DomainsStore.removeChangeListener(this.onChange);
    },

    onChange() {
        this.setState({domains: DomainsStore.getDomainList()});
    },

    onRefreshChange() {
        VegaDNSActions.listDomains();
    },

    render: function() {
        var domains = [];

        for (var key in this.state.domains) {
            domains.push(<DomainListEntry key={key} domain={this.state.domains[key]} />);
        }

        var addDomainForm = <DomainAddForm hideCallback={this.hideAddDomainForm} />

        var domainList = 
            <div>
                <h1>Domains</h1>
                <div className="pull-right">
                    <a className="btn btn-primary" onClick={this.showAddDomainForm} role="button">add</a>
                </div>
                <table className="table table-hover">
                    <thead>
                        <th>name</th>
                        <th>status</th>
                        <th>delete</th>
                        <th>id</th>
                    </thead>
                    <tbody>
                        {domains}
                    </tbody>
                </table>
            </div>

        return (
            <section id="domains">
                {this.state.showAddForm  ? addDomainForm : domainList}
            </section>
        );
    }
});

module.exports = DomainList;
