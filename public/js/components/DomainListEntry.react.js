var React = require('react');
var ReactPropTypes = React.PropTypes;
var VegaDNSActions = require('../actions/VegaDNSActions');
var ConfirmDialog = require('./ConfirmDialog.react');
var VegaDNSClient = require('../utils/VegaDNSClient');

var DomainListEntry = React.createClass({
    getInitialState: function() {
        return {
            showConfirmDeleteDialog: false,
            statusChecked: this.props.domain.status == "active"
        }
    },

    propTypes: {
        domain: ReactPropTypes.object.isRequired,
        listCallback: ReactPropTypes.func.isRequired
    },

    showDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: true});
    },

    hideDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: false});
    },

    handleDeleteDomain: function(e) {
        e.preventDefault();

        let domain = this.props.domain;
        VegaDNSClient.deleteDomain(domain.domain_id)
        .success(data => {
            VegaDNSActions.successNotification("Domain \"" + domain.domain + "\" deleted successfully");
            this.props.listCallback();
        }).error(data => {
            VegaDNSActions.errorNotification("Domain deletion was unsuccessful: ", data);
        });

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

        VegaDNSClient.updateDomainStatus(this.props.domain.domain_id, newStatus)
        .success(data => {
            VegaDNSActions.successNotification("Domain status updated successfully");
            this.props.listCallback();
        }).error(data => {
            VegaDNSActions.errorNotification("Domain status update was unsuccessful: ", data);
        });
    },

    render: function() {
        var domain = this.props.domain;
        var domain_owner = "none";
        if (this.props.domain_owner != null) {
            domain_owner = this.props.domain_owner.email;
        }
        var url = "#records?domain-id=" + domain.domain_id;
        var confirmDeleteDialog = <ConfirmDialog confirmText={"Are you sure you wan't to delete the domain \"" + domain.domain + "\"?"} confirmCallback={this.handleDeleteDomain} cancelCallback={this.hideDeleteConfirmDialog} />
        var statusCheckbox = null;
        if (this.props.account.account_type == "senior_admin") {
            statusCheckbox = <input type="checkbox" checked={this.state.statusChecked} onChange={this.changeStatus} />
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
                <td><a href={"#domainOwnerEdit?domain_id=" + domain.domain_id}>{domain_owner}</a></td>
                <td>{deleteButton}</td>
                <td className="hidden-xs">{domain.domain_id}</td>
            </tr>
        );
    }
});

export default DomainListEntry;
