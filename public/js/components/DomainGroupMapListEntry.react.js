var React = require('react');
var ReactPropTypes = React.PropTypes;
var VegaDNSActions = require('../actions/VegaDNSActions');
var ConfirmDialog = require('./ConfirmDialog.react');
var VegaDNSClient = require('../utils/VegaDNSClient');

var DomainGroupMapListEntry = React.createClass({
    getInitialState: function() {
        return {
            showConfirmDeleteDialog: false
        }
    },

    propTypes: {
        domaingroupmap: ReactPropTypes.object.isRequired,
        listCallback: ReactPropTypes.func.isRequired
    },

    showDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: true});
    },

    hideDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: false});
    },

    handleDeleteDomainGroupMap: function() {
        VegaDNSClient.deleteDomainGroupMap(this.props.domaingroupmap.map_id)
        .success(data => {
            VegaDNSActions.successNotification(
                "Domain removed from group successfully"
            );
            this.props.listCallback();
        }).error(data => {
            VegaDNSActions.addNotification(
                "Domain removal from group failed: ",
                data
            );
        });
    },

    changePermissions: function(e) {
        let permissions = {
            can_read: this.props.domaingroupmap.can_read ? 1 : 0,
            can_write: this.props.domaingroupmap.can_write ? 1 : 0,
            can_delete: this.props.domaingroupmap.can_delete ? 1 :0
        }

        switch (e.target.name) {
            case "can_read":
                permissions.can_read = e.target.checked ? 1 : 0;
                break;
            case "can_write":
                permissions.can_write = e.target.checked ? 1 : 0;
                break;
            case "can_delete":
                permissions.can_delete = e.target.checked ? 1 : 0;
                break;
        }

        VegaDNSClient.editDomainGroupMap(this.props.domaingroupmap.map_id, permissions)
        .success(data => {
            VegaDNSActions.successNotification(
                "Group permissions on domain updated successfully"
            );
            this.props.listCallback();
        }).error(data => {
            VegaDNSActions.addNotification(
                "Group permissions update on domain failed: ",
                data
            );
        });
    },

    render: function() {
        var domaingroupmap = this.props.domaingroupmap;
        var confirmDeleteDialog = <ConfirmDialog
                                    confirmText={"Are you sure you wan't to delete the domain " + domaingroupmap.domain.domain + " from this group?"}
                                    confirmCallback={this.handleDeleteDomainGroupMap}
                                    cancelCallback={this.hideDeleteConfirmDialog}
                                  />

        if (this.state.showConfirmDeleteDialog) {
            return (<tr>
                    <td colSpan="5">{confirmDeleteDialog}</td>
                </tr>
            );
        }
        return (
            <tr>
                <td>{domaingroupmap.domain.domain}</td>
                <td>
                    <input type="checkbox" name="can_read" onClick={this.changePermissions} defaultChecked={domaingroupmap.can_read} />
                </td>
                <td>
                    <input type="checkbox" name="can_write" onClick={this.changePermissions} defaultChecked={domaingroupmap.can_write} />
                </td>
                <td>
                    <input type="checkbox" name="can_delete" onClick={this.changePermissions} defaultChecked={domaingroupmap.can_delete} />
                </td>
                <td><button type="button" onClick={this.showDeleteConfirmDialog} className="btn btn-danger btn-xs">delete</button></td>
                <td>{domaingroupmap.map_id}</td>
            </tr>
        );
    }
});

module.exports = DomainGroupMapListEntry;
