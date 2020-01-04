var React = require('react');
var createClass = require('create-react-class');
var VegaDNSActions = require('../actions/VegaDNSActions');
var RecordEditForm = require('./RecordEditForm.react');
var VegaDNSClient = require('../utils/VegaDNSClient');

var RecordEdit = React.createClass({
    getInitialState: function() {
        return {
            record: {},
            locations: []
        }
    },

    componentWillMount: function() {
        this.getRecord();
        this.listLocations();
    },

    getRecord: function() {
        VegaDNSClient.getRecord(this.props.params["record-id"])
        .success(data => {
            this.setState({
                record: data.record
            });
        }).error(data => {
            var message = "Record not found";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.errorNotification(
                "Unable to retrieve record: ",
                data
            );
        });
    },

    handleCancel: function() {
        VegaDNSActions.redirect("records?domain-id=" + this.props.params["domain-id"]);
    },

    listLocations() {
        this.setState({locations: []});

        VegaDNSClient.locations()
        .success(data => {
            this.setState({
                locations: data.locations
            });
        }).error(data => {
            VegaDNSActions.errorNotifcation(
                "Unable to retrieve locations: ",
                data
            );
        });
    },

    render: function() {
        if (Object.keys(this.state.record).length) {
            return (
                <section id="record_edit">
                    <RecordEditForm locations={this.state.locations} key={this.state.record.record_id} record={this.state.record} cancelCallback={this.handleCancel} />
                </section>
            );
        }
        return (
            <section id="record_edit"></section>
        );

    }
});

export default RecordEdit;
