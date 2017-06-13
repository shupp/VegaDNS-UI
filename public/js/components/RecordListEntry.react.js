var React = require('react');
var ReactPropTypes = React.PropTypes;
var VegaDNSActions = require('../actions/VegaDNSActions');
var ConfirmDialog = require('./ConfirmDialog.react');
var VegaDNSClient = require('../utils/VegaDNSClient');

var RecordListEntry = React.createClass({
    getInitialState: function() {
        return {
            showConfirmDeleteDialog: false
        }
    },

    propTypes: {
        record: ReactPropTypes.object.isRequired,
        locations: ReactPropTypes.array.isRequired,
        listCallback: ReactPropTypes.func.isRequired
    },

    showDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: true});
    },

    hideDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: false});
    },

    handleDeleteRecord: function(e) {
        e.preventDefault();
        VegaDNSClient.deleteRecord(this.props.record.record_id)
        .success(data => {
            VegaDNSActions.successNotification(
                "Record deleted successfully"
            );
            this.props.listCallback();
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Unable to delete record: ",
                data
            );
        });
    },

    handleEditRecord: function(e) {
        e.preventDefault();
        VegaDNSActions.redirect(
            "recordEdit?record-id=" + this.props.record.record_id + "&domain-id=" + this.props.domain.domain_id
        );
    },

    getLocationName(location_id) {
        for (var i = 0; i < this.props.locations.length; i++) {
            if (this.props.locations[i].location_id == location_id) {
                return this.props.locations[i].location;
            }
        }

        return location_id;
    },

    render: function() {
        var record = this.props.record;
        var distance = 'n/a';
        var weight = 'n/a';
        var port = 'n/a';

        if (typeof record.distance !== 'undefined') {
            distance = record.distance;
        }
        if (typeof record.weight !== 'undefined') {
            weight = record.weight;
        }
        if (typeof record.port !== 'undefined') {
            port = record.port;
        }

        var confirmDeleteDialog = <ConfirmDialog
            confirmText={"Are you sure you wan't to delete the " + record.record_type + " record \"" + record.name + "\"?"}
            confirmCallback={this.handleDeleteRecord}
            cancelCallback={this.hideDeleteConfirmDialog} />

        if (this.state.showConfirmDeleteDialog) {
            return (<tr>
                    <td colSpan="9">{confirmDeleteDialog}</td>
                </tr>
            );
        }

        var editButton = <button type="button" onClick={this.handleEditRecord} className="btn btn-primary btn-xs">edit</button>
        var deleteButton = <button type="button" onClick={this.showDeleteConfirmDialog} className="btn btn-danger btn-xs">delete</button>

        if (! this.props.domain.permissions.can_write) {
            editButton = <button type="button" className="btn btn-primary btn-xs" disabled="disabled">edit</button>
            deleteButton = <button type="button" className="btn btn-danger btn-xs" disabled="disabled">delete</button>
        }

        var locationName = "";
        if (record.location_id != null) {
            locationName = <a href={"#locationPrefixes?location_id=" + record.location_id}>{this.getLocationName(record.location_id)}</a>
        }

        var value = record.value;
        if (record.record_type == "CAA") {
            value = record.flag + " " + record.tag + " \"" + record.tagval + "\""
        }

        return (
            <tr>
                <td>{record.name}</td>
                <td>{record.record_type}</td>
                <td>{value}</td>
                <td>{record.ttl}</td>
                <td>{distance}</td>
                <td>{weight}</td>
                <td>{port}</td>
                <td>{locationName}</td>
                <td>{editButton}</td>
                <td>{deleteButton}</td>
                <td className="hidden-sm hidden-xs">{record.record_id}</td>
            </tr>
        );
    }
});

module.exports = RecordListEntry;
