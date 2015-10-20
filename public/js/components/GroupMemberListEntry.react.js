var React = require('react');
var ReactPropTypes = React.PropTypes;
var VegaDNSActions = require('../actions/VegaDNSActions');
var ConfirmDialog = require('./ConfirmDialog.react');

var GroupMemberListEntry = React.createClass({
    getInitialState: function() {
        return {
            showConfirmDeleteDialog: false
        }
    },

    propTypes: {
        groupmember: ReactPropTypes.object.isRequired
    },

    showDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: true});
    },

    hideDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: false});
    },

    handleDeleteGroupMember: function() {
        VegaDNSActions.deleteGroupMember(this.props.group, this.props.groupmember.account, this.props.groupmember.member_id);
        this.setState({showConfirmDeleteDialog: false});
    },

    changeAdminStatus: function(e) {
        var newValue = e.target.checked == true ? 1 : 0;
        VegaDNSActions.editGroupMember(this.props.groupmember.member_id, newValue);
    },

    render: function() {
        var groupmember = this.props.groupmember;
        var confirmDeleteDialog = <ConfirmDialog confirmText={"Are you sure you wan't to delete the groupmember \"" + groupmember.account.email + "\"?"} confirmCallback={this.handleDeleteGroupMember} cancelCallback={this.hideDeleteConfirmDialog} />
        if (this.state.showConfirmDeleteDialog) {
            return (<tr>
                    <td colSpan="5">{confirmDeleteDialog}</td>
                </tr>
            );
        }
        return (
            <tr>
                <td>{groupmember.account.first_name} {groupmember.account.last_name}</td>
                <td>{groupmember.account.email}</td>
                <td>
                    <input type="checkbox" onClick={this.changeAdminStatus} defaultChecked={groupmember.is_admin} />
                </td>
                <td><button type="button" onClick={this.showDeleteConfirmDialog} className="btn btn-danger btn-xs">delete</button></td>
                <td>{groupmember.member_id}</td>
            </tr>
        );
    }
});

module.exports = GroupMemberListEntry;
