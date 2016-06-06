var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var RecordsStore = require('../stores/RecordsStore');
var LocationsStore = require('../stores/LocationsStore');
var RecordEditForm = require('./RecordEditForm.react');

var RecordEdit = React.createClass({
    getInitialState: function() {
        return {
            record: {},
            locations: []
        }
    },

    componentWillMount: function() {
        this.getRecord();
        VegaDNSActions.listLocations();
    },

    getRecord: function() {
        VegaDNSActions.getRecord(this.props.params["record-id"]);
    },

    componentDidMount: function() {
        RecordsStore.addChangeListener(this.onChange);
        LocationsStore.addChangeListener(this.getLocations);
    },

    componentWillUnmount: function() {
        RecordsStore.removeChangeListener(this.onChange);
        LocationsStore.removeChangeListener(this.getLocations);
    },

    handleCancel: function() {
        VegaDNSActions.redirect("records?domain-id=" + this.props.params["domain-id"]);
    },

    onChange() {
        this.setState({record: RecordsStore.getRecord()});
    },

    getLocations() {
        this.setState({locations: LocationsStore.getLocationList()});
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
