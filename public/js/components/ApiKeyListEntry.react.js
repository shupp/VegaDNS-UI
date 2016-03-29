var React = require('react');
var ReactPropTypes = React.PropTypes;
var VegaDNSActions = require('../actions/VegaDNSActions');
var ConfirmDialog = require('./ConfirmDialog.react');

var ApiKeyListEntry = React.createClass({
    getInitialState: function() {
        return {
            showConfirmDeleteDialog: false
        }
    },

    propTypes: {
        apikey: ReactPropTypes.object.isRequired
    },

    showDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: true});
    },

    hideDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: false});
    },

    handleDeleteApiKey: function() {
        VegaDNSActions.deleteApiKey(this.props.apikey.apikey_id);
        this.setState({showConfirmDeleteDialog: false});
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

module.exports = ApiKeyListEntry;
