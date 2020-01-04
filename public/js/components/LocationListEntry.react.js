var React = require('react');
var createClass = require('create-react-class');
var ReactPropTypes = React.PropTypes;
var VegaDNSActions = require('../actions/VegaDNSActions');
var ConfirmDialog = require('./ConfirmDialog.react');
var VegaDNSClient = require('../utils/VegaDNSClient');

var LocationListEntry = createClass({
    getInitialState: function() {
        return {
            showConfirmDeleteDialog: false
        }
    },

    propTypes: {
        location_entry: ReactPropTypes.object.isRequired,
        listCallback: ReactPropTypes.func.isRequired
    },

    showDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: true});
    },

    hideDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: false});
    },

    handleDeleteLocation: function(e) {
        e.preventDefault();

        VegaDNSClient.deleteLocation(this.props.location_entry.location_id)
        .success(data => {
            VegaDNSActions.successNotification(
                "Location deleted successfully"
            );
            this.props.listCallback();
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Unable to delete location: ", data
            );
        });

        return false;
    },

    handleEditLocation: function(e) {
        e.preventDefault();
        VegaDNSActions.redirect(
            "locationEdit?location_id=" + this.props.location_entry.location_id
        );
    },

    render: function() {
        var location_entry = this.props.location_entry;

        var confirmDeleteDialog = <ConfirmDialog
            confirmText={"Are you sure you wan't to delete location \"" + location_entry.location + "\" and all of its networks prefixes?"}
            confirmCallback={this.handleDeleteLocation}
            cancelCallback={this.hideDeleteConfirmDialog} />

        if (this.state.showConfirmDeleteDialog) {
            return (<tr>
                    <td colSpan="9">{confirmDeleteDialog}</td>
                </tr>
            );
        }

        var editButton = <button type="button" onClick={this.handleEditLocation} className="btn btn-primary btn-xs">edit</button>
        var deleteButton = <button type="button" onClick={this.showDeleteConfirmDialog} className="btn btn-danger btn-xs">delete</button>

        if (this.props.account.account_type != "senior_admin") {
            editButton = <button type="button" className="btn btn-primary btn-xs" disabled="disabled">edit</button>
            deleteButton = <button type="button" className="btn btn-danger btn-xs" disabled="disabled">delete</button>
        }

        return (
            <tr>
                <td><a href={"#locationPrefixes?location_id=" + location_entry.location_id}>{location_entry.location}</a></td>
                <td>{location_entry.location_description}</td>
                <td>{editButton}</td>
                <td>{deleteButton}</td>
                <td>{location_entry.location_id}</td>
            </tr>
        );
    }
});

export default LocationListEntry;
