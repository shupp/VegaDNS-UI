var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var AccountEditForm = require('./AccountEditForm.react');
var VegaDNSClient = require('../utils/VegaDNSClient');
var LogInStore = require('../stores/LogInStore');

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
        VegaDNSClient.getAccount(this.props.params["account-id"])
        .success(data => {
            this.setState({account: data.account});
        }).error(data => {
            VegaDNSActions.errorNotification("Unable to retrieve account: ", data);
        });
    },

    handleCancel: function() {
        VegaDNSActions.redirect("accounts");
    },

    render: function() {
        if (Object.keys(this.state.account).length) {
            var isMyAccount;
            var loginAccount = LogInStore.getAccount();
            if (loginAccount != null && this.state.account.account_id == loginAccount.account_id) {
                isMyAccount = true;
            }
            return (
                <section id="account_edit">
                    <AccountEditForm isMyAccount={isMyAccount} key={this.state.account.account_id} account={this.state.account} cancelCallback={this.handleCancel} />
                </section>
            );
        }
        return (
            <section id="account_edit"></section>
        );

    }
});

export default AccountEdit;
