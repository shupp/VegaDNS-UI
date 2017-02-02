var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var RecordEditSOAForm = require('./RecordEditSOAForm.react');
var VegaDNSClient = require('../utils/VegaDNSClient');
var ConfirmDialog = require('./ConfirmDialog.react');
var Loader = require('react-loader');

var RecordEditSOA = React.createClass({
    getInitialState: function() {
        return {
            showConfirmDeleteDialog: false,
            loaded: false,
            record: {},
            domain: {}
        }
    },

    componentWillMount: function() {
        this.getSOARecord();
    },

    showDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: true});
    },

    hideDeleteConfirmDialog: function() {
        this.setState({showConfirmDeleteDialog: false});
    },

    getSOARecord: function() {
        this.setState({loaded: false});
        VegaDNSClient.getSOARecord(this.props.params["domain-id"])
        .success(data => {
            if (data.records.length > 0) {
                this.setState({
                    record: data.records[0],
                    domain: data.domain,
                    loaded: true
                });
            } else {
                /* Account for no SOA */
                this.setState({
                    domain: data.domain,
                    loaded: true
                });
            }
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Unable to retrieve SOA record: ",
                data
            );
        });
    },

    handleCancel: function() {
        VegaDNSActions.redirect("records?domain-id=" + this.props.params["domain-id"]);
    },

    createSOARecord: function() {
        VegaDNSClient.addDefaultSOA(this.props.params["domain-id"])
        .success(data => {
            VegaDNSActions.successNotification(
                "SOA record created successfully"
            );
            VegaDNSActions.redirect("records?domain-id=" + this.props.params["domain-id"]);
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Unable to create default SOA record: ",
                data
            );
        });
    },

    deleteSOARecord: function() {
        VegaDNSClient.deleteRecord(this.state.record["record_id"])
        .success(data => {
            VegaDNSActions.successNotification(
                "SOA record deleted successfully"
            );
            VegaDNSActions.redirect("records?domain-id=" + this.props.params["domain-id"]);
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Unable to delete SOA record: ",
                data
            );
        });
    },

    render: function() {
        var page;
        if (Object.keys(this.state.record).length) {
            var confirmDeleteDialog = <ConfirmDialog
                confirmText={"Are you sure you wan't to delete the SOA record for this domain?"}
                confirmCallback={this.deleteSOARecord}
                cancelCallback={this.hideDeleteConfirmDialog} />

            var deleteButton;

            if (this.state.showConfirmDeleteDialog) {
                deleteButton = confirmDeleteDialog;
            } else {
                deleteButton = <button type="submit" onClick={this.showDeleteConfirmDialog} className="btn btn-danger">Delete</button>
            }

            page = 
                <div>
                    <RecordEditSOAForm
                        key={this.state.record.record_id}
                        record={this.state.record}
                        domain={this.state.domain}
                        cancelCallback={this.handleCancel}
                        deleteCallback={this.deleteSOARecord}
                    />
                    <div className="row">
                        <form className="form-horizontal">
                            <div className="col-sm-offset-4 col-sm-8">
                                {deleteButton}
                            </div>
                        </form>
                    </div>
                </div>
        } else {
            page = <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>This domain does not have an SOA record.  Would you like to create one?</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <button type="submit" onClick={this.createSOARecord} className="btn btn-danger">Create</button> &nbsp;
                        <button type="submit" onClick={this.handleCancel} className="btn btn-primary">Cancel</button>
                    </div>
                </div>
            </div>
        }

        return (
            <section id="record_edit_soa">
                <Loader loaded={this.state.loaded}>
                    {page}
                </Loader>
            </section>
        );

    }
});

module.exports = RecordEditSOA;
