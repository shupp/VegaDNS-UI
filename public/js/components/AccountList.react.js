var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var AccountsStore = require('../stores/AccountsStore');
var AccountListEntry = require('./AccountListEntry.react');
var AccountAddForm = require('./AccountAddForm.react');

var AccountList = React.createClass({
    getInitialState: function() {
        return {
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
        VegaDNSActions.listAccounts();
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

    render: function() {
        var accounts = [];

        for (var key in this.state.accounts) {
            accounts.push(<AccountListEntry key={key} account={this.state.accounts[key]} />);
        }

        var addAccountForm = <AccountAddForm hideCallback={this.hideAddAccountForm} />
        var keyList = 
                <div>
                    <h2 className="text-center">Accounts</h2>
                    <div className="pull-right">
                        <a className="btn btn-primary" onClick={this.showAddAccountForm} role="button">add</a>
                    </div>
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
                                <th>id</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts}
                        </tbody>
                    </table>
                </div>

        return (
            <section id="accounts">
                {this.state.showAddForm  ? addAccountForm : keyList}
            </section>
        );
    }
});

module.exports = AccountList;
