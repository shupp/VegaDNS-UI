var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var DomainsStore = require('../stores/DomainsStore');
var AccountsStore = require('../stores/AccountsStore');
var DomainListEntry = require('./DomainListEntry.react');
var DomainAddForm = require('./DomainAddForm.react');

var DomainList = React.createClass({
    getInitialState: function() {
        return {
            domains: [],
            accounts: [],
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
        VegaDNSActions.listAccounts();
    },

    componentDidMount: function() {
        DomainsStore.addRefreshChangeListener(this.onRefreshChange);
        DomainsStore.addChangeListener(this.onChange);
        AccountsStore.addRefreshChangeListener(this.onRefreshChange);
        AccountsStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        DomainsStore.removeRefreshChangeListener(this.onRefreshChange);
        DomainsStore.removeChangeListener(this.onChange);
        AccountsStore.removeRefreshChangeListener(this.onRefreshChange);
        AccountsStore.removeChangeListener(this.onChange);
    },

    onChange() {
        var accounts = AccountsStore.getAccountList();
        var accountHash = {}
        for (var account in accounts) {
            accountHash[accounts[account].account_id] = accounts[account];
        }
        this.setState({
            domains: DomainsStore.getDomainList(),
            accounts: accountHash
        });
    },

    onRefreshChange() {
        VegaDNSActions.listDomains();
        VegaDNSActions.listAccounts();
    },

    render: function() {
        var domains = [];

        for (var key in this.state.domains) {
            var domain = this.state.domains[key];
            var domain_owner = null;
            if (typeof this.state.accounts[domain.owner_id] !== "undefined") {
                domain_owner = this.state.accounts[domain.owner_id];
            }
            domains.push(<DomainListEntry key={key} domain={this.state.domains[key]} domain_owner={domain_owner} account={this.props.account} />);
        }

        var addDomainForm = <DomainAddForm hideCallback={this.hideAddDomainForm} />

        var domainList = 
            <div>
                <h2 className="text-center">Domains</h2>
                <div className="pull-right">
                    <a className="btn btn-primary" onClick={this.showAddDomainForm} role="button">add</a>
                </div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>name</th>
                            <th>status</th>
                            <th>owner</th>
                            <th>delete</th>
                            <th>id</th>
                        </tr>
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
