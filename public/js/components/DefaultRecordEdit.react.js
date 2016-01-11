var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var DefaultRecordsStore = require('../stores/DefaultRecordsStore');
var DefaultRecordEditForm = require('./DefaultRecordEditForm.react');

var DefaultRecordEdit = React.createClass({
    getInitialState: function() {
        return {
            record: {}
        }
    },

    componentWillMount: function() {
        this.getDefaultRecord();
    },

    getDefaultRecord: function() {
        VegaDNSActions.getDefaultRecord(this.props.params["record-id"]);
    },

    componentDidMount: function() {
        DefaultRecordsStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        DefaultRecordsStore.removeChangeListener(this.onChange);
    },

    handleCancel: function() {
        VegaDNSActions.redirect("defaultRecords");
    },

    onChange() {
        this.setState({record: DefaultRecordsStore.getDefaultRecord()});
    },

    render: function() {
        if (Object.keys(this.state.record).length) {
            return (
                <section id="record_edit">
                    <DefaultRecordEditForm key={this.state.record.record_id} record={this.state.record} cancelCallback={this.handleCancel} />
                </section>
            );
        }
        return (
            <section id="record_edit"></section>
        );

    }
});

module.exports = DefaultRecordEdit;
