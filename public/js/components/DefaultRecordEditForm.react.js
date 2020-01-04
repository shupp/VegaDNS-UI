var React = require('react');
var createClass = require('create-react-class');
var VegaDNSActions = require('../actions/VegaDNSActions');
var VegaDNSClient = require('../utils/VegaDNSClient');

var DefaultRecordEditForm = React.createClass({
    getInitialState: function() {
        var defaults = {
            'name': "",
            'value': "",
            'distance': "",
            'weight': "",
            'port': "",
            'ttl': 3600
        }
        var values = defaults;
        for (var key in this.props.record) {
            values[key] = this.props.record[key];
        }

        return values;
    },

    handleChange: function(name, e) {
        var change = {};
        change[name] = e.target.value;
        this.setState(change);
    },

    editDefaultRecord: function(e) {
        e.preventDefault();

        var payload = {}
        for (var key in this.state) {
            payload[key] = this.state[key];
        }
        payload["record_id"] = this.props.record.record_id;

        let default_record = payload;
        VegaDNSClient.editDefaultRecord(default_record)
        .success(data => {
            VegaDNSActions.successNotification(
                "Default Record " + default_record.name + " updated successfully"
            );
            VegaDNSActions.redirect("defaultRecords");
        }).error(data => {
            VegaDNSActions.addNotification(
                "Default Record edit failed: ",
                data
            );
        });
    },

    render: function() {
        var distance;
        if (typeof this.state.distance != 'undefined') {
            distance =
                <div className="form-group">
                    <label htmlFor="distance" className="col-sm-4 control-label">Distance/Priority</label>
                    <div className="col-sm-2">
                        <input onChange={this.handleChange.bind(this, 'distance')} className="form-control" id="distance" />
                    </div>
                </div>
        }

        var weight;
        if (typeof this.state.weight != 'undefined') {
            weight =
                <div className="form-group">
                    <label htmlFor="weight" className="col-sm-4 control-label">Weight</label>
                    <div className="col-sm-2">
                        <input onChange={this.handleChange.bind(this, 'weight')} className="form-control" id="weight" />
                    </div>
                </div>
        }

        var port;
        if (typeof this.state.port != 'undefined') {
            port =
                <div className="form-group">
                    <label htmlFor="port" className="col-sm-4 control-label">Port</label>
                    <div className="col-sm-2">
                        <input onChange={this.handleChange.bind(this, 'port')} className="form-control" id="port" />
                    </div>
                </div>
        }

        return (
            <section id="add_record">
                <h3 className="text-center">Edit default {this.state.record_type} record "{this.state.name}"</h3>
                <form className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="disabledSelect" className="col-sm-4 control-label">RR Type</label>
                        <div className="col-sm-2" style={{"paddingTop": "6px"}}>
                                {this.state.record_type}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name" className="col-sm-4 control-label">Hostname</label>
                        <div className="col-sm-6">
                            <input value={this.state.name} onChange={this.handleChange.bind(this, 'name')} className="form-control" id="name" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="value" className="col-sm-4 control-label">Value (target)</label>
                        <div className="col-sm-8">
                            <input value={this.state.value} onChange={this.handleChange.bind(this, 'value')} className="form-control" id="value" />
                        </div>
                    </div>
                    {["MX", "SRV"].indexOf(this.state.record_type) > -1 ? distance : null}
                    {this.state.record_type == "SRV" ? weight : null}
                    {this.state.record_type == "SRV" ? port : null}
                    <div className="form-group">
                        <label htmlFor="ttl" className="col-sm-4 control-label">TTL (seconds)</label>
                        <div className="col-sm-2">
                            <input onChange={this.handleChange.bind(this, 'ttl')} className="form-control" id="ttl" value={this.state.ttl} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8">
                            <button type="submit" onClick={this.editDefaultRecord} className="btn btn-success">edit</button>
                            &nbsp;
                            <button type="submit" onClick={this.props.cancelCallback} className="btn btn-danger">Cancel</button>
                        </div>
                    </div>
                </form>
            </section>
        );
    }
});

export default DefaultRecordEditForm;
