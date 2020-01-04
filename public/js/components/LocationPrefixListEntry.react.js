var React = require('react');
var ReactPropTypes = React.PropTypes;
var VegaDNSActions = require('../actions/VegaDNSActions');
var ConfirmDialog = require('./ConfirmDialog.react');
var VegaDNSClient = require('../utils/VegaDNSClient');

var LocationPrefixesListEntry = React.createClass({
    getInitialState: function() {
        return {
            showConfirmDeleteDialog: false
        }
    },

    propTypes: {
        location: ReactPropTypes.object.isRequired,
        location_prefix: ReactPropTypes.object.isRequired,
        listCallback: ReactPropTypes.func.isRequired
    },

    showDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: true});
    },

    hideDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: false});
    },

    handleDeleteLocationPrefix: function(e) {
        e.preventDefault();

        VegaDNSClient.deleteLocationPrefix(this.props.location_prefix.prefix_id)
        .success(data => {
            VegaDNSActions.successNotification(
                "Location prefix deleted successfully"
            );
            this.props.listCallback();
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Unable to delete location prefix: ",
                data
            );
        });
    },

    handleEditLocationPrefix: function(e) {
        e.preventDefault();
        VegaDNSActions.redirect(
            "locationPrefixEdit?prefix_id=" + this.props.location_prefix.prefix_id
        );
    },

    render: function() {
        var location = this.props.location;
        var location_prefix = this.props.location_prefix;

        var confirmDeleteDialog = <ConfirmDialog
            confirmText={"Are you sure you wan't to delete location prefix \""+ location_prefix.prefix + "\"?"}
            confirmCallback={this.handleDeleteLocationPrefix}
            cancelCallback={this.hideDeleteConfirmDialog} />

        if (this.state.showConfirmDeleteDialog) {
            return (<tr>
                    <td colSpan="9">{confirmDeleteDialog}</td>
                </tr>
            );
        }

        var editButton = <button type="button" onClick={this.handleEditLocationPrefix} className="btn btn-primary btn-xs">edit</button>
        var deleteButton = <button type="button" onClick={this.showDeleteConfirmDialog} className="btn btn-danger btn-xs">delete</button>

        if (this.props.account.account_type != "senior_admin") {
            editButton = <button type="button" className="btn btn-primary btn-xs" disabled="disabled">edit</button>
            deleteButton = <button type="button" className="btn btn-danger btn-xs" disabled="disabled">delete</button>
        }

        return (
            <tr>
                <td>{location_prefix.prefix}</td>
                <td>{location_prefix.prefix_description}</td>
                <td>{location_prefix.prefix_type}</td>
                <td>{editButton}</td>
                <td>{deleteButton}</td>
                <td>{location_prefix.prefix_id}</td>
            </tr>
        );
    }
});

export default LocationPrefixesListEntry;
