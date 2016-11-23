var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var RecordEditSOAForm = require('./RecordEditSOAForm.react');
var VegaDNSClient = require('../utils/VegaDNSClient');

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
        VegaDNSClient.getSOARecord(this.props.params["domain-id"])
        .success(data => {
            this.setState({
                record: data.records[0],
                domain: data.domain
            });
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
