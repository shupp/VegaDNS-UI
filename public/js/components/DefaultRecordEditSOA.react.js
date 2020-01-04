var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var DefaultRecordEditSOAForm = require('./DefaultRecordEditSOAForm.react');
var VegaDNSClient = require('../utils/VegaDNSClient');

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
        VegaDNSClient.getDefaultSOARecord()
        .success(data => {
            this.setState({
                record: data.default_records[0]
            });
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Default SOA Record not found: ",
                data
            );
        });
    },

    handleCancel: function() {
        VegaDNSActions.redirect("defaultRecords");
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

export default DefaultRecordEditSOA;
