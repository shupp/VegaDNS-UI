var React = require('react');
var ReactPropTypes = React.PropTypes;
var VegaDNSActions = require('../actions/VegaDNSActions');
var ConfirmDialog = require('./ConfirmDialog.react');
var VegaDNSClient = require('../utils/VegaDNSClient');

var ApiKeyListEntry = React.createClass({
    getInitialState: function() {
        return {
            showConfirmDeleteDialog: false
        }
    },

    propTypes: {
        apikey: ReactPropTypes.object.isRequired,
        listCallback: ReactPropTypes.func.isRequired
    },

    showDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: true});
    },

    hideDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: false});
    },

    handleDeleteApiKey: function() {
        VegaDNSClient.deleteApiKey(this.props.apikey.apikey_id)
        .success(data => {
            VegaDNSActions.successNotification(
                "API key deleted successfully"
            );
            this.props.listCallback();
        }).error(data => {
            VegaDNSActions.errorNotification(
                "API key deletion failed: ",
                data
            );
        });
    },

    render: function() {
        var apikey = this.props.apikey;
        var confirmDeleteDialog = <ConfirmDialog confirmText="Are you sure you wan't to delete this key?" confirmCallback={this.handleDeleteApiKey} cancelCallback={this.hideDeleteConfirmDialog} />
        if (this.state.showConfirmDeleteDialog) {
            return (<tr>
                    <td colSpan="5">{confirmDeleteDialog}</td>
                </tr>
            );
        }
        return (
            <tr>
                <td>{apikey.description}</td>
                <td>{apikey.key}</td>
                <td>{apikey.secret}</td>
                <td><button type="button" onClick={this.showDeleteConfirmDialog} className="btn btn-danger btn-xs" value={apikey.apikey_id}>delete</button></td>
                <td className="hidden-xs hidden-sm">{apikey.apikey_id}</td>
            </tr>
        );
    }
});

export default ApiKeyListEntry;
