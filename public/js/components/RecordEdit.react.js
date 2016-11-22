var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var RecordsStore = require('../stores/RecordsStore');
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
        VegaDNSActions.getRecord(this.props.params["record-id"]);
    },

    componentDidMount: function() {
        RecordsStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        RecordsStore.removeChangeListener(this.onChange);
    },

    handleCancel: function() {
        VegaDNSActions.redirect("records?domain-id=" + this.props.params["domain-id"]);
    },

    onChange() {
        this.setState({record: RecordsStore.getRecord()});
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

module.exports = RecordEdit;
