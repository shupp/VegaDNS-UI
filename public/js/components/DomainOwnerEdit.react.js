var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var VegaDNSConstants = require('../constants/VegaDNSConstants');
var Select = require('react-select');
var VegaDNSClient = require('../utils/VegaDNSClient');
var accounts = [];

var DomainOwnerEdit = React.createClass({
    getInitialState: function() {
        return {
            domain: {},
            account: {account_id: 0},
            selected_account: false,
        }
    },

    componentWillMount: function() {
        VegaDNSClient.getDomain(this.props.params.domain_id)
        .success(data => {
            this.setState(
                {
                    domain: data.domain
                },
                this.fetchAccount
            );
        }).error(data => {
            VegaDNSActions.errorNotification("Unable to retrieve domain: ", data);
        });
    },

    fetchAccount: function() {
        if (this.state.domain.owner_id != 0) {
            VegaDNSClient.getAccount(this.state.domain.owner_id)
            .success(data => {
                this.setState({
                    account: data.account
                });
            }).error(data => {
                VegaDNSActions.errorNotification("Unable to retrieve account: ", data);
            });
        }
    },

    selectAccountId(accountId) {
        this.state.selected_account = accountId;
    },

    searchAccounts(input, callback) {
        VegaDNSClient.accounts(input)
        .success(data => {
            /* Format account for display */
            var options = [];
            for (var i = 0; i < data.accounts.length; i++) {
                accounts[data.accounts[i].account_id] = data.accounts[i];
                var account = data.accounts[i];
                options.push({
                        value: account.account_id,
                        label: account.first_name + " " + account.last_name + " - " + account.email
                });
            }
            callback(
                null,
                {
                    options: options
                }
            );
        }).error(data => {
            var message = "Not found";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            callback(message, null);
        });
    },

    changeDomainOwner: function(e) {
        e.preventDefault();
        if (this.state.selected_account === false) {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                "Please select a new domain owner",
                true
            );
        } else {
            VegaDNSClient.updateDomainOwner(
                this.state.domain.domain_id,
                this.state.selected_account
            ).success(data => {
                VegaDNSActions.successNotification("Domain owner updated successfully");
                VegaDNSActions.redirect('domains');
            }).error(data => {
                VegaDNSActions.errorNotification("Domain owner update was unsuccessful: ", data);
            });
        }
    },

    removeDomainOwner: function(e) {
        e.preventDefault();

        VegaDNSClient.updateDomainOwner(
            this.state.domain.domain_id,
            0
        ).success(data => {
            VegaDNSActions.successNotification("Domain owner removed successfully");
            VegaDNSActions.redirect('domains');
        }).error(data => {
            VegaDNSActions.errorNotification("Domain owner update was unsuccessful: ", data);
        });
    },

    render: function() {
        var domain = this.state.domain;
        var account = this.state.account;
        var accountText;
        var removeOwner;

        if (account.account_id == 0) {
            accountText = "none";
        } else {
            accountText = account.first_name + " " + account.last_name + " " + account.email;
            removeOwner = <button type="submit" onClick={this.removeDomainOwner} className="btn btn-info" style={{"marginRight": "10px"}}>remove owner</button>
        }

        return (
            <section id="edit_domain_owner">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="text-center">Edit Domain Owner for {domain.domain}</h3>
                        <br />
                    </div>
                </div>
                <div className="row">
                    <div className="hidden-xs hidden-sm col-md-2"></div>
                    <div className="col-xs-12 col-sm-12 col-md-8">
                        <form className="form-horizontal">
                            <div className="form-group">
                                <label htmlFor="current_owner" className="col-xs-3 col-sm-4 col-md-4 control-label">Current Owner</label>
                                <div className="col-xs-8 col-sm-8 col-md-4">
                                    <p className="form-control-static">{accountText}</p>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name" className="col-xs-3 col-sm-4 col-md-2 control-label">Select New Owner</label>
                                <div className="col-xs-7 col-sm-7 col-md-6">
                                    <Select
                                        name="selected_account_id"
                                        autoload={false}
                                        asyncOptions={this.searchAccounts}
                                        onChange={this.selectAccountId}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-xs-3 col-sm-4 col-md-2 control-label"></div>
                                <div className="col-xs-7 col-sm-7 col-md-6 text-right">
                                    {removeOwner} <button type="submit" onClick={this.changeDomainOwner} className="btn btn-primary">edit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="hidden-xs hidden-sm col-md-1"></div>
                </div>
            </section>
        );
    }
});

module.exports = DomainOwnerEdit;
