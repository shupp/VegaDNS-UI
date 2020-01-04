var React = require('react'); var VegaDNSActions = require('../actions/VegaDNSActions');
var VegaDNSActions = require('../actions/VegaDNSActions');
var VegaDNSClient = require('../utils/VegaDNSClient');

var DomainAddForm = React.createClass({
    getInitialState: function() {
        return {
            domain: "",
            skipSoa: false,
            skipDefaultRecords: false,
            moveCollidingRecords: false
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

    handleSkipDefaultRecordsChange: function(e) {
        this.setState({
            skipDefaultRecords: e.target.checked
        });
    },

    handleMoveCollidingRecordsChange: function(e) {
        this.setState({
            moveCollidingRecords: e.target.checked
        });
    },

    addDomain: function(e) {
        e.preventDefault();

        VegaDNSClient.addDomain(
            this.state.domain,
            this.state.skipSoa,
            this.state.skipDefaultRecords,
            this.state.moveCollidingRecords
        ).success(data => {
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
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" onChange={this.handleSkipDefaultRecordsChange} id="skip_default_records" checked={this.state.skipDefaultRecords} />
                            Skip creating ALL default records
                        </label>
                    </div>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" onChange={this.handleMoveCollidingRecordsChange} id="move_colliding_records" checked={this.state.moveCollidingRecords} />
                            Move colliding records (<em>e.g.: Creating domain "foo.bar.com" would move existing A record "foo.bar.com" of existing domain "bar.com" into this new domain.</em>)
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

export default DomainAddForm;
