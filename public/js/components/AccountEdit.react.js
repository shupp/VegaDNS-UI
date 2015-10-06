var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var AccountsStore = require('../stores/AccountsStore');
var AccountEditForm = require('./AccountEditForm.react');

var AccountEdit = React.createClass({
    getInitialState: function() {
        return {
            account: {}
        }
    },

    componentWillMount: function() {
        this.getAccount();
    },

    getAccount: function() {
        VegaDNSActions.getAccount(this.props.params["account-id"]);
    },

    componentDidMount: function() {
        AccountsStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        AccountsStore.removeChangeListener(this.onChange);
    },

    handleCancel: function() {
        VegaDNSActions.redirect("accounts");
    },

    onChange() {
        this.setState({account: AccountsStore.getAccount()});
    },

    render: function() {
        if (Object.keys(this.state.account).length) {
            return (
                <section id="account_edit">
                    <AccountEditForm key={this.state.account.account_id} account={this.state.account} cancelCallback={this.handleCancel} />
                </section>
            );
        }
        return (
            <section id="account_edit"></section>
        );

    }
});

module.exports = AccountEdit;
