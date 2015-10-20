var React = require('react');
var ReactPropTypes = React.PropTypes;
var VegaDNSActions = require('../actions/VegaDNSActions');
var ConfirmDialog = require('./ConfirmDialog.react');

var DomainGroupMapListEntry = React.createClass({
    getInitialState: function() {
        return {
            showConfirmDeleteDialog: false,
            can_read: this.props.domaingroupmap.can_read,
            can_write: this.props.domaingroupmap.can_write,
            can_read: this.props.domaingroupmap.can_delete
        }
    },

    propTypes: {
        domaingroupmap: ReactPropTypes.object.isRequired
    },

    showDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: true});
    },

    hideDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: false});
    },

    handleDeleteDomainGroupMap: function() {
        VegaDNSActions.deleteDomainGroupMap(this.props.domaingroupmap);
        this.setState({showConfirmDeleteDialog: false});
    },

    changePermissions: function(e) {
        switch (e.target.name) {
            case "can_read":
                this.state.can_read = e.target.checked;
                break;
            case "can_write":
                this.state.can_write = e.target.checked;
                break;
            case "can_delete":
                this.state.can_delete = e.target.checked;
                break;
        }

        var permissions = {
            can_read: this.state.can_read ? 1 : 0,
            can_write: this.state.can_write ? 1 : 0,
            can_delete: this.state.can_delete ? 1 : 0
        }

        VegaDNSActions.editDomainGroupMap(this.props.domaingroupmap.map_id, permissions);
    },

    render: function() {
        var domaingroupmap = this.props.domaingroupmap;
        var confirmDeleteDialog = <ConfirmDialog confirmText={"Are you sure you wan't to delete the domain " + domaingroupmap.domain.domain + " from this group?"} confirmCallback={this.handleDeleteDomainGroupMap} cancelCallback={this.hideDeleteConfirmDialog} />

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
