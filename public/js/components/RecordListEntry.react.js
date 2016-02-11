var React = require('react');
var ReactPropTypes = React.PropTypes;
var VegaDNSActions = require('../actions/VegaDNSActions');
var ConfirmDialog = require('./ConfirmDialog.react');

var RecordListEntry = React.createClass({
    getInitialState: function() {
        return {
            showConfirmDeleteDialog: false
        }
    },

    propTypes: {
        record: ReactPropTypes.object.isRequired
    },

    showDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: true});
    },

    hideDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: false});
    },

    handleDeleteRecord: function(e) {
        e.preventDefault();
        VegaDNSActions.deleteRecord(this.props.record.record_id);
    },

    handleEditRecord: function(e) {
        e.preventDefault();
        VegaDNSActions.redirect(
            "recordEdit?record-id=" + this.props.record.record_id + "&domain-id=" + this.props.domain.domain_id
        );
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

        return (
            <tr>
                <td>{record.name}</td>
                <td>{record.record_type}</td>
                <td>{record.value}</td>
                <td>{record.ttl}</td>
                <td>{distance}</td>
                <td>{weight}</td>
                <td>{port}</td>
                <td>{editButton}</td>
                <td>{deleteButton}</td>
                <td>{record.record_id}</td>
            </tr>
        );
    }
});

module.exports = RecordListEntry;
