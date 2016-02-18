var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var AccountsStore = require('../stores/AccountsStore');
var AccountListEntry = require('./AccountListEntry.react');
var AccountAddForm = require('./AccountAddForm.react');

var AccountList = React.createClass({
    getInitialState: function() {
        return {
            search: false,
            accounts: [],
            showAddForm: false
        }
    },

    showAddAccountForm: function() {
        this.setState({showAddForm: true});
    },

    hideAddAccountForm: function() {
        this.setState({showAddForm: false});
    },

    componentWillMount: function() {
        this.listAccounts();
    },

    listAccounts: function() {
        VegaDNSActions.listAccounts(this.state.search);
    },

    componentDidMount: function() {
        AccountsStore.addChangeListener(this.onChange);
        AccountsStore.addRefreshChangeListener(this.listAccounts);
    },

    componentWillUnmount: function() {
        AccountsStore.removeChangeListener(this.onChange);
        AccountsStore.removeRefreshChangeListener(this.listAccounts);
    },

    onChange() {
        this.setState({
            accounts: AccountsStore.getAccountList(),
            showAddForm: false
        });
    },

    searchAccounts(e) {
        var value = e.target.value;
        if (value.length < 1) {
            value = false;
        }
        this.setState(
            {search: value},
            this.listAccounts
        );
    },

    clearSearch() {
        if (this.state.search !== false) {
            this.setState(
                {search: false},
                this.listAccounts
            );
        }
    },

    render: function() {
        var accounts = [];

        for (var key in this.state.accounts) {
            accounts.push(<AccountListEntry key={key} account={this.state.accounts[key]} />);
        }

        var searchValue = this.state.search;
        if (searchValue === false) {
            searchValue = "";
        }

        var addAccountForm = 
            <div className="row">
                <AccountAddForm hideCallback={this.hideAddAccountForm} />
            </div>
        var accountList = 
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="text-center">Accounts</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6 pull left">
                        <form className="form-horizontal">
                            <div className="form-group">
                                <label htmlFor="accounts_search" className="col-sm-2 control-label">Search</label>
                                <div className="col-sm-4 btn-group">
                                    <input type="text" className="form-control" onChange={this.searchAccounts} id="account_search" value={searchValue} />
                                    <span onClick={this.clearSearch} className="searchclear">x</span>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="pull-right">
                        <a className="btn btn-primary" onClick={this.showAddAccountForm} role="button">add</a>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>name</th>
                                    <th>email</th>
                                    <th>phone</th>
                                    <th>type</th>
                                    <th>status</th>
                                    <th>edit</th>
                                    <th>delete</th>
                                    <th className="hidden-xs">id</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        return (
            <section id="accounts">
                {this.state.showAddForm  ? addAccountForm : accountList}
            </section>
        );
    }
});

module.exports = AccountList;
