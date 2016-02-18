var React = require('react');
var ReactPropTypes = React.PropTypes;
var VegaDNSActions = require('../actions/VegaDNSActions');
var ConfirmDialog = require('./ConfirmDialog.react');

var AccountListEntry = React.createClass({
    getInitialState: function() {
        return {
            showConfirmDeleteDialog: false
        }
    },

    propTypes: {
        account: ReactPropTypes.object.isRequired
    },

    showDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: true});
    },

    hideDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: false});
    },

    handleDeleteAccount: function() {
        VegaDNSActions.deleteAccount(this.props.account);
        this.setState({showConfirmDeleteDialog: false});
    },

    handleEditAccount: function() {
        VegaDNSActions.redirect("accountEdit?account-id=" + this.props.account.account_id);
    },

    render: function() {
        var account = this.props.account;
        var confirmDeleteDialog = <ConfirmDialog confirmText={"Are you sure you wan't to delete the account \"" + this.props.account.email + "\"?"} confirmCallback={this.handleDeleteAccount} cancelCallback={this.hideDeleteConfirmDialog} />
        if (this.state.showConfirmDeleteDialog) {
            return (<tr>
                    <td colSpan="5">{confirmDeleteDialog}</td>
                </tr>
            );
        }
        return (
            <tr>
                <td>{account.first_name} {account.last_name}</td>
                <td>{account.email}</td>
                <td>{account.phone}</td>
                <td>{account.account_type}</td>
                <td>{account.status}</td>
                <td><button type="button" onClick={this.handleEditAccount} className="btn btn-primary btn-xs">edit</button></td>
                <td><button type="button" onClick={this.showDeleteConfirmDialog} className="btn btn-danger btn-xs">delete</button></td>
                <td className="hidden-xs">{account.account_id}</td>
            </tr>
        );
    }
});

module.exports = AccountListEntry;
