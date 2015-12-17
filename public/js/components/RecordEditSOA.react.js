var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var RecordsStore = require('../stores/RecordsStore');
var RecordEditSOAForm = require('./RecordEditSOAForm.react');

var RecordEditSOA = React.createClass({
    getInitialState: function() {
        return {
            record: {},
            domain: {}
        }
    },

    componentWillMount: function() {
        this.getSOARecord();
    },

    getSOARecord: function() {
        VegaDNSActions.getSOARecord(this.props.params["domain-id"]);
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
        this.setState({
            record: RecordsStore.getSOARecord(),
            domain: RecordsStore.getDomain()
        });
    },

    render: function() {
        if (Object.keys(this.state.record).length) {
            return (
                <section id="record_edit_soa">
                    <RecordEditSOAForm key={this.state.record.record_id} record={this.state.record} domain={this.state.domain} cancelCallback={this.handleCancel} />
                </section>
            );
        }
        return (
            <section id="record_edit"></section>
        );

    }
});

module.exports = RecordEditSOA;
