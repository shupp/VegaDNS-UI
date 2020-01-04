var React = require('react');
var createClass = require('create-react-class');
var VegaDNSActions = require('../actions/VegaDNSActions');
var VegaDNSClient = require('../utils/VegaDNSClient');

var AccountAddForm = createClass({
    getInitialState: function() {
        return {
            'first_name': "",
            'last_name': "",
            'email': "",
            'password': "",
            'account_type': "senior_admin",
            'phone': "",
            'status': "active"
        }
    },
    handleChange: function(name, e) {
        var change = {};
        change[name] = e.target.value;
        this.setState(change);
    },

    addAccount: function(e) {
        e.preventDefault();

        var payload = {}
        for (var key in this.state) {
            payload[key] = this.state[key];
        }

        VegaDNSClient.addAccount(payload)
        .success(data => {
            VegaDNSActions.successNotification(
                "Account " + payload.email + " created successfully",
            );
            this.props.listCallback()
        }).error(data => {
            VegaDNSActions.errorNotification("Error creating account: ", data);
        });
    },

    render: function() {
        return (
            <section id="add_account">
                <h3 className="text-center">Create a new account</h3>
                <form className="form-horizontal" autoComplete="off">
                    <div className="form-group">
                        <label htmlFor="first_name" className="col-sm-4 control-label">First Name</label>
                        <div className="col-sm-8">
                            <input onChange={this.handleChange.bind(this, 'first_name')} className="form-control" id="first_name" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="last_name" className="col-sm-4 control-label">Last Name</label>
                        <div className="col-sm-8">
                            <input onChange={this.handleChange.bind(this, 'last_name')} className="form-control" id="last_name" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="col-sm-4 control-label">Email Address</label>
                        <div className="col-sm-8">
                            <input type="email" onChange={this.handleChange.bind(this, 'email')} className="form-control" autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="col-sm-4 control-label">Password</label>
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
                            <button type="submit" onClick={this.addAccount} className="btn btn-success">Create</button>
                            &nbsp;
                            <button type="submit" onClick={this.props.hideCallback} className="btn btn-danger">Cancel</button>
                        </div>
                    </div>
                </form>
            </section>
        );
    }
});

export default AccountAddForm;
