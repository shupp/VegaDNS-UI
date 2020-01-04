var React = require('react');
var createClass = require('create-react-class');
var ReactPropTypes = require('prop-types');
var VegaDNSActions = require('../actions/VegaDNSActions');
var ConfirmDialog = require('./ConfirmDialog.react');
var VegaDNSClient = require('../utils/VegaDNSClient');

var GroupListEntry = createClass({
    getInitialState: function() {
        return {
            showConfirmDeleteDialog: false
        }
    },

    propTypes: {
        group: ReactPropTypes.object.isRequired,
        listCallback: ReactPropTypes.func.isRequired
    },

    showDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: true});
    },

    hideDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: false});
    },

    handleDeleteGroup: function() {
        VegaDNSClient.deleteGroup(this.props.group.group_id)
        .success(data => {
            VegaDNSActions.successNotification(
                "Group \"" + this.props.group.name + "\" deleted successfully",
            );
            this.props.listCallback();
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Group deletion failed: ",
                data
            );
        });
    },

    handleEditGroup: function() {
        VegaDNSActions.redirect("groupEdit?group-id=" + this.props.group.group_id);
    },

    render: function() {
        var group = this.props.group;
        var confirmDeleteDialog = <ConfirmDialog confirmText={"Are you sure you wan't to delete the group \"" + this.props.group.name + "\"?"} confirmCallback={this.handleDeleteGroup} cancelCallback={this.hideDeleteConfirmDialog} />
        if (this.state.showConfirmDeleteDialog) {
            return (<tr>
                    <td colSpan="5">{confirmDeleteDialog}</td>
                </tr>
            );
        }
        return (
            <tr>
                <td>{group.name}</td>
                <td><button type="button" onClick={this.handleEditGroup} className="btn btn-primary btn-xs">edit</button></td>
                <td><button type="button" onClick={this.showDeleteConfirmDialog} className="btn btn-danger btn-xs">delete</button></td>
                <td>{group.group_id}</td>
            </tr>
        );
    }
});

export default GroupListEntry;
