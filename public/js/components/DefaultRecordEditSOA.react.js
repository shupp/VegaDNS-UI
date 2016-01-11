var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var DefaultRecordsStore = require('../stores/DefaultRecordsStore');
var DefaultRecordEditSOAForm = require('./DefaultRecordEditSOAForm.react');

var DefaultRecordEditSOA = React.createClass({
    getInitialState: function() {
        return {
            record: {}
        }
    },

    componentWillMount: function() {
        this.getDefaultSOARecord();
    },

    getDefaultSOARecord: function() {
        VegaDNSActions.getDefaultSOARecord();
    },

    componentDidMount: function() {
        DefaultRecordsStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        DefaultRecordsStore.removeChangeListener(this.onChange);
    },

    handleCancel: function() {
        VegaDNSActions.redirect("");
    },

    onChange() {
        this.setState({
            record: DefaultRecordsStore.getDefaultSOARecord()
        });
    },

    render: function() {
        if (Object.keys(this.state.record).length) {
            return (
                <section id="default_record_edit_soa">
                    <DefaultRecordEditSOAForm key={this.state.record.record_id} record={this.state.record} cancelCallback={this.handleCancel} />
                </section>
            );
        } else {
            return (
                <section id="default_record_edit"></section>
            );
        }

    }
});

module.exports = DefaultRecordEditSOA;
