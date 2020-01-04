var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var LogInStore = require('../stores/LogInStore');
var AccountEditForm = require('./AccountEditForm.react');
var VegaDNSClient = require('../utils/VegaDNSClient');

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

        VegaDNSClient.getAccount(account.account_id)
        .success(data => {
            this.setState({
                account: data.account
            });
        }).error(data => {
            VegaDNSActions.errorNotification("Unable to load account: ", data);
        });
    },

    handleCancel: function() {
        VegaDNSActions.redirect("");
    },

    render: function() {
        if (Object.keys(this.state.account).length) {
            return (
                <section id="my_account_edit">
                    <AccountEditForm isMyAccount={true} homeRedirect={true} key={this.state.account.account_id} account={this.state.account} cancelCallback={this.handleCancel} />
                </section>
            );
        }
        return (
            <section id="my_account_edit"></section>
        );

    }
});

export default MyAccountEdit;
