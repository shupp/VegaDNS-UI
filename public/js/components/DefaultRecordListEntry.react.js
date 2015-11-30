var React = require('react');
var ReactPropTypes = React.PropTypes;
var VegaDNSActions = require('../actions/VegaDNSActions');
var ConfirmDialog = require('./ConfirmDialog.react');

var DefaultRecordListEntry = React.createClass({
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
        VegaDNSActions.deleteDefaultRecord(this.props.default_record.record_id);
    },

    handleEditDefaultRecord: function(e) {
        e.preventDefault();
        VegaDNSActions.redirect(
            "defaultRecordEdit?record-id=" + this.props.record.record_id
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
            confirmText={"Are you sure you wan't to delete the default " + record.record_type + " record \"" + record.name + "\"?"}
            confirmCallback={this.handleDeleteDefaultRecord}
            cancelCallback={this.hideDeleteConfirmDialog} />

        if (this.state.showConfirmDeleteDialog) {
            return (<tr>
                    <td colSpan="9">{confirmDeleteDialog}</td>
                </tr>
            );
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
                <td><button type="button" onClick={this.handleEditDefaultRecord} className="btn btn-primary btn-xs">edit</button></td>
                <td><button type="button" onClick={this.showDeleteConfirmDialog} className="btn btn-danger btn-xs">delete</button></td>
                <td>{record.record_id}</td>
            </tr>
        );
    }
});

module.exports = DefaultRecordListEntry;
