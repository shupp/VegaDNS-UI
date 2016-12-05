var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var Select = require('react-select');
var VegaDNSClient = require('../utils/VegaDNSClient');
var GroupMemberListEntry = require('./GroupMemberListEntry.react');
var accounts = [];

var GroupMemberList = React.createClass({
    getInitialState: function() {
        return {
            groupmembers: [],
            selected_account: null
        }
    },

    componentWillMount: function() {
        this.listGroupMembers();
    },

    listGroupMembers: function() {
        this.setState({
            groupmembers: [],
            selected_account: null
        });
        VegaDNSClient.groupmembers(this.props.group.group_id)
        .success(data => {
            this.setState({
                groupmembers: data.groupmembers
            });
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Unable to retrieve group members: ",
                data
            );
        });
    },

    addGroupMember: function(e) {
        e.preventDefault();

        let group = this.props.group;
        let account = accounts[this.state.selected_account.value];

        VegaDNSClient.addGroupMember(group.group_id, account.account_id)
        .success(data => {
            VegaDNSActions.successNotification(
                account.first_name + " " + account.last_name + " added to group \"" + group.name + "\" successfully"
            );
            this.listGroupMembers();
        }).error(data => {
            VegaDNSActions.addNotification(
                "Adding account to group failed: ",
                data
            );
        });
    },

    selectAccountId(accountId) {
        this.setState({
            selected_account: accountId
        });
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

    render: function() {
        var groupmembers = [];
        for (var key in this.state.groupmembers) {
            groupmembers.push(<GroupMemberListEntry key={key} groupmember={this.state.groupmembers[key]} group={this.props.group} listCallback={this.listGroupMembers} />);
        }

        return (
            <section id="group_members">
                <h4 className="text-center">Add Group Member</h4>
                <form className="form-horizontal" autoComplete="off">
                    <div className="form-group">
                        <label htmlFor="name" className="col-md-2 control-label">Account </label>
                        <div className="col-md-8">
                            <Select.Async
                                name="selected_account_id"
                                isLoading={true}
                                cache={false}
                                loadOptions={this.searchAccounts}
                                onChange={this.selectAccountId}
                                value={this.state.selected_account}
                            />
                        </div>
                        <div className="col-md-1">
                            <button type="submit" onClick={this.addGroupMember} className="btn btn-primary">add</button>
                        </div>
                        <div className="col-md-12">
                            <br />
                            <br />
                        </div>
                    </div>
                </form>

                <div>
                    <h4 className="text-center">Group Members</h4>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>name</th>
                                <th>email</th>
                                <th>admin</th>
                                <th>delete</th>
                                <th>id</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupmembers}
                        </tbody>
                    </table>
                </div>
            </section>
        );
    }
});

module.exports = GroupMemberList;
