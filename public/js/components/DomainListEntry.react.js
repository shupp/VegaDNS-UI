var React = require('react');
var ReactPropTypes = React.PropTypes;
var VegaDNSActions = require('../actions/VegaDNSActions');
var ConfirmDialog = require('./ConfirmDialog.react');

var DomainListEntry = React.createClass({
    getInitialState: function() {
        return {
            showConfirmDeleteDialog: false
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

    render: function() {
        var domain = this.props.domain;
        var url = "#records?domain-id=" + domain.domain_id;
        var confirmDeleteDialog = <ConfirmDialog confirmText={"Are you sure you wan't to delete the domain \"" + domain.domain + "\"?"} confirmCallback={this.handleDeleteDomain} cancelCallback={this.hideDeleteConfirmDialog} />
        if (this.state.showConfirmDeleteDialog) {
            return (<tr>
                    <td colSpan="5">{confirmDeleteDialog}</td>
                </tr>
            );
        }
        return (
            <tr>
                <td><a href={url}>{domain.domain}</a></td>
                <td>{domain.status}</td>
                <td><button type="button" onClick={this.showDeleteConfirmDialog} className="btn btn-danger btn-xs">delete</button></td>
                <td>{domain.domain_id}</td>
            </tr>
        );
    }
});

module.exports = DomainListEntry;
