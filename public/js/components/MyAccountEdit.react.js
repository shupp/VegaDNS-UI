var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var AccountsStore = require('../stores/AccountsStore');
var LogInStore = require('../stores/LogInStore');
var AccountEditForm = require('./AccountEditForm.react');

var MyAccountEdit = React.createClass({
    getInitialState: function() {
        return {
            account: {}
        }
    },

    componentWillMount: function() {
        this.getAccount();
    },

    getAccount: function() {
        var account = LogInStore.getAccount();
        VegaDNSActions.getAccount(account.account_id);
    },

    componentDidMount: function() {
        AccountsStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        AccountsStore.removeChangeListener(this.onChange);
    },

    handleCancel: function() {
        VegaDNSActions.redirect("");
    },

    onChange() {
        this.setState({account: AccountsStore.getAccount()});
    },

    render: function() {
        if (Object.keys(this.state.account).length) {
            return (
                <section id="my_account_edit">
                    <AccountEditForm isMyAccount={true} key={this.state.account.account_id} account={this.state.account} cancelCallback={this.handleCancel} />
                </section>
            );
        }
        return (
            <section id="my_account_edit"></section>
        );

    }
});

module.exports = MyAccountEdit;
