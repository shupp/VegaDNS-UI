var React = require('react');
var createClass = require('create-react-class');
var VegaDNSActions = require('../actions/VegaDNSActions');
var DefaultRecordEditForm = require('./DefaultRecordEditForm.react');
var VegaDNSClient = require('../utils/VegaDNSClient');

var DefaultRecordEdit = createClass({
    getInitialState: function() {
        return {
            record: {}
        }
    },

    componentWillMount: function() {
        this.getDefaultRecord();
    },

    getDefaultRecord: function() {
        VegaDNSClient.getDefaultRecord(this.props.params["record-id"])
        .success(data => {
            this.setState({
                record: data.default_record
            });
        }).error(data => {
            VegaDNSActions.addNotification(
                "Unable to retrieve default record: ",
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

export default DefaultRecordEdit;
