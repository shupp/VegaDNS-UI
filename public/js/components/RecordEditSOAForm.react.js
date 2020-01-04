var React = require('react');
var createClass = require('create-react-class');
var VegaDNSActions = require('../actions/VegaDNSActions');
var VegaDNSClient = require('../utils/VegaDNSClient');

var RecordEditSOAForm = React.createClass({
    getInitialState: function() {
        var defaults = {
            'nameserver': "",
            'email': "hostmaster." + this.props.domain.domain,
            'serial': "",
            'ttl': 86400,
            'refresh': 16384,
            'retry': 2048,
            'expire': 1048576,
            'minimum': 2560
        };
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

    editRecord: function(e) {
        e.preventDefault();

        var payload = {}
        for (var key in this.state) {
            payload[key] = this.state[key];
        }
        payload["record_id"] = this.props.record.record_id;
        payload["record_type"] = this.props.record.record_type;

        let record = payload;

        VegaDNSClient.editRecord(record)
        .success(data => {
            VegaDNSActions.successNotification(
                "SOA record updated successfully"
            );
            VegaDNSActions.redirect("records?domain-id=" + record.domain_id);
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Unable to edit SOA record: ",
                data
            );
        });
    },

    render: function() {
        return (
            <section id="edit_record">
                <h3 className="text-center">Edit SOA record for "{this.props.domain.domain}"</h3>
                <form className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="nameserver" className="col-sm-4 control-label">Primary Name Server</label>
                        <div className="col-sm-6">
                            <input value={this.state.nameserver} onChange={this.handleChange.bind(this, 'nameserver')} className="form-control" id="nameserver" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="col-sm-4 control-label">Contact Address</label>
                        <div className="col-sm-6">
                            <input value={this.state.email} onChange={this.handleChange.bind(this, 'email')} className="form-control" id="email" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="serial" className="col-sm-4 control-label">Serial Number <br />(leave blank for default)</label>
                        <div className="col-sm-6">
                            <input value={this.state.serial} onChange={this.handleChange.bind(this, 'serial')} className="form-control" id="serial" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="ttl" className="col-sm-4 control-label">TTL</label>
                        <div className="col-sm-6">
                            <input value={this.state.ttl} onChange={this.handleChange.bind(this, 'ttl')} className="form-control" id="ttl" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="refresh" className="col-sm-4 control-label">Refresh</label>
                        <div className="col-sm-6">
                            <input value={this.state.refresh} onChange={this.handleChange.bind(this, 'refresh')} className="form-control" id="refresh" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="retry" className="col-sm-4 control-label">retry</label>
                        <div className="col-sm-6">
                            <input value={this.state.retry} onChange={this.handleChange.bind(this, 'retry')} className="form-control" id="retry" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="expire" className="col-sm-4 control-label">Expire</label>
                        <div className="col-sm-6">
                            <input value={this.state.expire} onChange={this.handleChange.bind(this, 'expire')} className="form-control" id="expire" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="minimum" className="col-sm-4 control-label">Minimum</label>
                        <div className="col-sm-6">
                            <input value={this.state.minimum} onChange={this.handleChange.bind(this, 'minimum')} className="form-control" id="minimum" />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8">
                            <button type="submit" onClick={this.editRecord} className="btn btn-success">Edit</button>
                            &nbsp;
                            <button type="submit" onClick={this.props.cancelCallback} className="btn btn-primary">Cancel</button>
                        </div>
                    </div>
                </form>
            </section>
        );
    }
});

export default RecordEditSOAForm;
