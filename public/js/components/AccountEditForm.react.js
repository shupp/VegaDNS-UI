var React = require('react');
var createClass = require('create-react-class');
var VegaDNSActions = require('../actions/VegaDNSActions');
var VegaDNSClient = require('../utils/VegaDNSClient');

var AccountEditForm = createClass({
    getInitialState: function() {
        return {
            'first_name': this.props.account.first_name,
            'last_name': this.props.account.last_name,
            'email': this.props.account.email,
            'phone': this.props.account.phone,
            'password': "",
            'account_type': this.props.account.account_type,
            'phone': this.props.account.phone,
            'status': this.props.account.status,
        }
    },

    handleChange: function(name, e) {
        var change = {};
        change[name] = e.target.value;
        this.setState(change);
    },

    editAccount: function(e) {
        e.preventDefault();

        var isMyAccount = false;
        if (typeof this.props.isMyAccount != 'undefined') {
            isMyAccount = true;
        }

        var homeRedirect = false;
        if (typeof this.props.homeRedirect != 'undefined') {
            homeRedirect = true;
        }

        var payload = {}
        for (var key in this.state) {
            if (key == "password") {
                /* only copy password if it has length */
                if (this.state["password"].length) {
                    payload[key] = this.state[key];
                }
            } else {
                payload[key] = this.state[key];
            }
        }
        payload["account_id"] = this.props.account.account_id;

        VegaDNSClient.editAccount(payload).success(data => {
            VegaDNSActions.successNotification("Account " + payload.email + " updated successfully");
            if (isMyAccount) {
                VegaDNSActions.updateLogin();
            }

            if (homeRedirect) {
                VegaDNSActions.redirect("");
            } else {
                VegaDNSActions.redirect("accounts");
            }
        }).error(data => {
            VegaDNSActions.errorNotification("Account edit failed: ", data);
        });
    },

    render: function() {
        var accountType = null;
        var accountStatus = null;
        var title = "Edit My Account";
        if (typeof this.props.isMyAccount == 'undefined') {
            title = "Edit Account";
            accountType =
                <div className="form-group">
                    <label htmlFor="account_type" className="col-sm-4 control-label">User Type</label>
                    <div className="col-sm-3">
                        <select id="account_type" onChange={this.handleChange.bind(this, 'account_type')} className="form-control" value={this.state.account_type}>
                            <option value="senior_admin">Senior Admin</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                </div>
            accountStatus =
                <div className="form-group">
                    <label htmlFor="status" className="col-sm-4 control-label">Account Status</label>
                    <div className="col-sm-3">
                        <select id="status" onChange={this.handleChange.bind(this, 'status')} className="form-control" value={this.state.status}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
        }

        return (
            <div className="row">
                <div className="col-md-12">
                    <h3 className="text-center">{title}</h3>
                </div>
                <div className="col-md-12">
                    <form className="form-horizontal" autoComplete="off">
                        <div className="form-group">
                            <label htmlFor="first_name" className="col-sm-4 control-label">First Name</label>
                            <div className="col-sm-8">
                                <input onChange={this.handleChange.bind(this, 'first_name')} className="form-control" id="first_name" value={this.state.first_name} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="last_name" className="col-sm-4 control-label">Last Name</label>
                            <div className="col-sm-8">
                                <input onChange={this.handleChange.bind(this, 'last_name')} className="form-control" id="last_name"  value={this.state.last_name} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="col-sm-4 control-label">Email Address</label>
                            <div className="col-sm-8">
                                <input type="text" onChange={this.handleChange.bind(this, 'email')} className="form-control" autoComplete="for-user-not-autofill" value={this.state.email} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone" className="col-sm-4 control-label">Phone</label>
                            <div className="col-sm-8">
                                <input type="tel" onChange={this.handleChange.bind(this, 'phone')} className="form-control" autoComplete="off" value={this.state.phone} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="col-sm-4 control-label">Change Password</label>
                            <div className="col-sm-8">
                                <input type="password" onChange={this.handleChange.bind(this, 'password')} autofill="for-user-not-autofill" className="form-control" />
                            </div>
                        </div>
                        {accountType}
                        {accountStatus}
                        <div className="form-group">
                            <div className="col-sm-4"></div>
                            <div className="col-sm-8">
                                <button type="submit" onClick={this.editAccount} className="btn btn-primary">Edit</button>
                                &nbsp;
                                <button type="submit" onClick={this.props.cancelCallback} className="btn btn-danger">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
});

export default AccountEditForm;
