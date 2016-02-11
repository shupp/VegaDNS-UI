var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var DomainsStore = require('../stores/DomainsStore');
var AccountsStore = require('../stores/AccountsStore');
var DomainListEntry = require('./DomainListEntry.react');
var DomainAddForm = require('./DomainAddForm.react');

var DomainList = React.createClass({
    getInitialState: function() {
        return {
            search: false,
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
        VegaDNSActions.listDomains(this.state.search);
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

    searchDomains(e) {
        var value = e.target.value;
        if (value.length < 1) {
            value = false;
        }
        this.setState({search: value});
        VegaDNSActions.listDomains(value);
    },

    clearSearch() {
        if (this.state.search !== false) {
            console.log('here');
            this.setState({search: false});
            VegaDNSActions.listDomains();
        }
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
        var searchValue = this.state.search;
        if (searchValue === false) {
            searchValue = "";
        }

        var domainList = 
            <div>
                <div className="row">
                    <h2 className="text-center">Domains</h2>
                </div>
                <div className="col-sm-6 pull left">
                    <form className="form-horizontal">
                        <div className="form-group">
                            <label htmlFor="domain_search" className="col-sm-2 control-label">Search</label>
                            <div className="col-sm-4 btn-group">
                                <input type="text" className="form-control" onChange={this.searchDomains} id="domain_search" value={searchValue} />
                                <span onClick={this.clearSearch} className="searchclear">x</span>
                            </div>
                        </div>
                    </form>
                </div>
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
