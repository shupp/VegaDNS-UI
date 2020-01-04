var React = require('react');
var createClass = require('create-react-class');
var ReactPropTypes = require('prop-types');
var VegaDNSActions = require('../actions/VegaDNSActions');
var VegaDNSClient = require('../utils/VegaDNSClient');

var DefaultRecordAddForm = createClass({
    getInitialState: function() {
        return {
            'record_type': "A",
            'name': "",
            'value': "",
            'distance': "",
            'weight': "",
            'port': "",
            'ttl': 3600,
        }
    },

    propTypes: {
        listCallback: ReactPropTypes.func.isRequired
    },

    handleChange: function(name, e) {
        var change = {};
        change[name] = e.target.value;
        this.setState(change);
    },

    addDefaultRecord: function(e) {
        e.preventDefault();

        var payload = {} 
        for (var key in this.state) {
            payload[key] = this.state[key];
        }
        payload["name"] = payload["name"];

        VegaDNSClient.addDefaultRecord(payload)
        .success(data => {
            VegaDNSActions.successNotification(
                "Default " + data.default_record.record_type + " record \"" + data.default_record.name + "\" created successfully"
            );
            this.props.listCallback();
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Unable to add default record: ",
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
                example = "ns1.example.com";
                break;
            case "MX":
                example = "mail.example.com";
                break;
            case "PTR":
                example = "www.example.com";
                break;
            case "TXT":
                example = "v=spf1 a -all";
                break;
            case "CNAME":
                example = "target.example.com";
                break;
            case "SRV":
                example = "_sip._tcp.example.com";
                break;
            case "SPF":
                example = "v=spf1 a -all";
                break;
        }


        return (
            <section id="add_record">
                <h3 className="text-center">Create a new default resource record</h3>
                <h5 className="text-center"><br />You can use <i>DOMAIN</i> in any label to be replaced with the domain name</h5>
                <h5 className="text-center">example: <i>www.DOMAIN</i> would become <i>www.example.com</i></h5>
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
                            <div className="col-sm-2 domain-suffix-text domain-suffix-no-padding"></div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="value" className="col-sm-4 control-label">Value (target)</label>
                        <div className="col-sm-8">
                            <input onChange={this.handleChange.bind(this, 'value')} className="form-control" id="value" placeholder="See example below"/>
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
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8">
                            <button type="submit" onClick={this.addDefaultRecord} className="btn btn-success">Create</button>
                            &nbsp;
                            <button type="submit" onClick={this.props.hideCallback} className="btn btn-danger">Cancel</button>
                        </div>
                    </div>
                </form>
            </section>
        );
    }
});

export default DefaultRecordAddForm;
