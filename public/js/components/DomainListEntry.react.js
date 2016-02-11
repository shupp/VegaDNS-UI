var React = require('react');
var ReactPropTypes = React.PropTypes;
var VegaDNSActions = require('../actions/VegaDNSActions');
var ConfirmDialog = require('./ConfirmDialog.react');

var DomainListEntry = React.createClass({
    getInitialState: function() {
        return {
            showConfirmDeleteDialog: false,
            statusChecked: this.props.domain.status == "active"
        }
    },

    propTypes: {
        domain: ReactPropTypes.object.isRequired
    },

    showDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: true});
    },

    hideDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: false});
    },

    handleDeleteDomain: function(e) {
        e.preventDefault();
        VegaDNSActions.deleteDomain(this.props.domain);
        this.setState({showConfirmDeleteDialog: false});
    },

    componentWillReceiveProps: function(props) {
        this.setState({
            statusChecked: props.domain.status == "active"
        });
    },

    changeStatus: function(e) {
        e.preventDefault();
        var newStatus;
        if (this.props.domain.status == "active") {
            newStatus = "inactive";
        } else {
            newStatus = "active";
        }
        VegaDNSActions.updateDomainStatus(this.props.domain.domain_id, newStatus);
    },

    render: function() {
        var domain = this.props.domain;
        var url = "#records?domain-id=" + domain.domain_id;
        var confirmDeleteDialog = <ConfirmDialog confirmText={"Are you sure you wan't to delete the domain \"" + domain.domain + "\"?"} confirmCallback={this.handleDeleteDomain} cancelCallback={this.hideDeleteConfirmDialog} />
        var statusCheckbox = null;
        if (this.props.account.account_type == "senior_admin") {
            statusCheckbox = <input type="checkbox" defaultChecked={domain.status == "active"} checked={this.state.statusChecked} onChange={this.changeStatus} />
        }
        if (this.state.showConfirmDeleteDialog) {
            return (<tr>
                    <td colSpan="5">{confirmDeleteDialog}</td>
                </tr>
            );
        }

        var deleteButton = deleteButton = <button type="button" onClick={this.showDeleteConfirmDialog} className="btn btn-danger btn-xs">delete</button>
        if (! domain.permissions.can_delete) {
            deleteButton = <button type="button" disabled="disabled" className="btn btn-danger btn-xs">delete</button>
        }
        return (
            <tr>
                <td><a href={url}>{domain.domain}</a></td>
                <td>{statusCheckbox} {domain.status}</td>
                <td>{domain.owner_id}</td>
                <td>{deleteButton}</td>
                <td>{domain.domain_id}</td>
            </tr>
        );
    }
});

module.exports = DomainListEntry;
