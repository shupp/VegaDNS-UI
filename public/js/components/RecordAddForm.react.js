var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var VegaDNSClient = require('../utils/VegaDNSClient');

var RecordAddForm = React.createClass({
    getInitialState: function() {
        return {
            'record_type': "A",
            'name': "",
            'value': "",
            'distance': "",
            'weight': "",
            'port': "",
            'location_id': null,
            'ttl': 3600,
        }
    },

    propTypes: {
        listCallback: React.PropTypes.func.isRequired
    },

    handleChange: function(name, e) {
        var change = {};
        change[name] = e.target.value;
        this.setState(change);
    },

    addRecord: function(e) {
        e.preventDefault();

        var payload = {} 
        for (var key in this.state) {
            if (this.state.record_type == "CNAME" && key == "value") {
                // Trim CNAME value
                payload[key] = String(this.state[key]).replace(/^\s+|\s+$/g, '');
            } else {
                payload[key] = this.state[key];
            }
        }
        if (payload["name"] == 0) {
            payload["name"] = this.props.domain.domain;
        } else {
            payload["name"] = payload["name"] + "." + this.props.domain.domain;
        }
        payload["domain_id"] = this.props.domain.domain_id;

        VegaDNSClient.addRecord(payload)
        .success(data => {
            VegaDNSActions.successNotification(
                data.record.record_type + " record \"" + data.record.name + "\" created successfully"
            );
            this.props.listCallback();
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Unable to create record: ",
                data
            );
        });
    },

    render: function() {
        var distance =
                    <div className="form-group">
                        <label htmlFor="distance" className="col-sm-4 control-label">Distance/Priority</label>
                        <div className="col-sm-2">
                            <input onChange={this.handleChange.bind(this, 'distance')} className="form-control" id="distance" />
                        </div>
                    </div>
        var weight =
                    <div className="form-group">
                        <label htmlFor="weight" className="col-sm-4 control-label">Weight</label>
                        <div className="col-sm-2">
                            <input onChange={this.handleChange.bind(this, 'weight')} className="form-control" id="weight" />
                        </div>
                    </div>
        var port =
                    <div className="form-group">
                        <label htmlFor="port" className="col-sm-4 control-label">Port</label>
                        <div className="col-sm-2">
                            <input onChange={this.handleChange.bind(this, 'port')} className="form-control" id="port" />
                        </div>
                    </div>

        var example = null;
        switch (this.state.record_type) {
            case "A":
            case "A+PTR":
                example = "1.2.3.4";
                break;
            case "AAAA":
            case "AAAA+PTR":
                example = "2001:cdba:0000:0000:0000:0000:3257:9652";
                break;
            case "NS":
                example = "ns1." + this.props.domain.domain;
                break;
            case "MX":
                example = "mail." + this.props.domain.domain;
                break;
            case "PTR":
                example = "www.example.com";
                break;
            case "TXT":
                example = "v=spf1 a -all";
                break;
            case "CNAME":
                example = "target." + this.props.domain.domain;
                break;
            case "SRV":
                example = "_sip._tcp." + this.props.domain.domain;
                break;
            case "SPF":
                example = "v=spf1 a -all";
                break;
        }

        var locationList = [];
        for (var i = 0; i < this.props.locations.length; i++) {
            locationList.push(<option key={i} value={this.props.locations[i].location_id}>{this.props.locations[i].location}</option>);
        }



        return (
            <section id="add_record">
                <h3 className="text-center">Create a new resource record for domain "{this.props.domain.domain}"</h3>
                <form className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="record_type" className="col-sm-4 control-label">RR Type</label>
                        <div className="col-sm-2">
                            <select id="record_type" onChange={this.handleChange.bind(this, 'record_type')} className="form-control" value={this.state.record_type}>
                                <option value="A">A</option>
                                <option value="A+PTR">A+PTR</option>
                                <option value="AAAA">AAAA</option>
                                <option value="AAAA+PTR">AAAA+PTR</option>
                                <option value="NS">NS</option>
                                <option value="MX">MX</option>
                                <option value="PTR">PTR</option>
                                <option value="TXT">TXT</option>
                                <option value="CNAME">CNAME</option>
                                <option value="SRV">SRV</option>
                                <option value="SPF">SPF</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name" className="col-sm-4 control-label">Hostname</label>
                        <div className="col-sm-6">
                            <div className="col-sm-4 domain-suffix-no-padding">
                                <input onChange={this.handleChange.bind(this, 'name')} className="form-control" id="name" />
                            </div>
                            <div className="col-sm-2 domain-suffix-text domain-suffix-no-padding">
                                .{this.props.domain.domain}
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="value" className="col-sm-4 control-label">Value (target)</label>
                        <div className="col-sm-8">
                            <input onChange={this.handleChange.bind(this, 'value')} className="form-control" id="value" value={this.state.value} placeholder="See example below"/>
                            Example: {example}
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
                        <label htmlFor="location_id" className="col-sm-4 control-label">Location</label>
                        <div className="col-sm-2">
                            <select id="location_id" onChange={this.handleChange.bind(this, 'location_id')} className="form-control" value={this.state.location_id}>
                                <option value={null}></option>
                                {locationList}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8">
                            <button type="submit" onClick={this.addRecord} className="btn btn-success">Create</button>
                            &nbsp;
                            <button type="submit" onClick={this.props.hideCallback} className="btn btn-danger">Cancel</button>
                        </div>
                    </div>
                </form>
            </section>
        );
    }
});

module.exports = RecordAddForm;
