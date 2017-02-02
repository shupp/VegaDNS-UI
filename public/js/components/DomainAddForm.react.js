var React = require('react'); var VegaDNSActions = require('../actions/VegaDNSActions');
var VegaDNSActions = require('../actions/VegaDNSActions');
var VegaDNSClient = require('../utils/VegaDNSClient');

var DomainAddForm = React.createClass({
    getInitialState: function() {
        return {
            domain: "",
            skipSoa: false
        }
    },

    handleDomainChange: function(e) {
        this.setState({domain: e.target.value});
    },

    handleSkipSOAChange: function(e) {
        this.setState({
            skipSoa: e.target.checked
        });
    },

    addDomain: function(e) {
        e.preventDefault();

        VegaDNSClient.addDomain(this.state.domain, this.state.skipSoa)
        .success(data => {
            var new_id = data.domain.domain_id;
            VegaDNSActions.successNotification("Domain created successfully");
            VegaDNSActions.redirect("records?domain-id=" + new_id);
        }).error(data => {
            VegaDNSActions.errorNotification("Domain creation was unsuccessful: ", data);
        });
    },

    render: function() {
        return (
            <section id="add_domain">
                <h2>Create a new domain</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="domain_name">domain name</label>
                        <input onChange={this.handleDomainChange} className="form-control" id="domain_name" placeholder="example.com" />
                    </div>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" onChange={this.handleSkipSOAChange} id="skip_soa" checked={this.state.skipSoa} />
                            Skip SOA record creation
                        </label>
                    </div>
                    <button type="submit" onClick={this.addDomain} className="btn btn-primary">Create</button>
                    &nbsp;
                    <button type="submit" onClick={this.props.hideCallback} className="btn btn-danger">Cancel</button>
                </form>
            </section>
        );
    }
});

module.exports = DomainAddForm;
