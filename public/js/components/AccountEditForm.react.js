var React = require('react'); var VegaDNSActions = require('../actions/VegaDNSActions');
var AccountsStore = require('../stores/AccountsStore');
var VegaDNSActions = require('../actions/VegaDNSActions');

var AccountEditForm = React.createClass({
    getInitialState: function() {
        return {
            'first_name': this.props.account.first_name,
            'last_name': this.props.account.last_name,
            'email': this.props.account.email,
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
        VegaDNSActions.editAccount(payload);
    },

    render: function() {
        return (
            <section id="edit_account">
                <h3 className="text-center">Edit Account</h3>
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
                            <input type="email" onChange={this.handleChange.bind(this, 'email')} className="form-control" autoComplete="off" value={this.state.email} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="col-sm-4 control-label">Change Password</label>
                        <div className="col-sm-8">
                            <input type="password" onChange={this.handleChange.bind(this, 'password')} className="form-control" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="account_type" className="col-sm-4 control-label">User Type</label>
                        <div className="col-sm-3">
                            <select id="account_type" onChange={this.handleChange.bind(this, 'account_type')} className="form-control" value={this.state.account_type}>
                                <option value="senior_admin">Senior Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="status" className="col-sm-4 control-label">Account Status</label>
                        <div className="col-sm-3">
                            <select id="status" onChange={this.handleChange.bind(this, 'status')} className="form-control" value={this.state.status}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8">
                            <button type="submit" onClick={this.editAccount} className="btn btn-primary">Edit</button>
                            &nbsp;
                            <button type="submit" onClick={this.props.cancelCallback} className="btn btn-danger">Cancel</button>
                        </div>
                    </div>
                </form>
            </section>
        );
    }
});

module.exports = AccountEditForm;
