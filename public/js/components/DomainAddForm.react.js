var React = require('react'); var VegaDNSActions = require('../actions/VegaDNSActions');
var VegaDNSActions = require('../actions/VegaDNSActions');

var DomainAddForm = React.createClass({
    handleDomainChange: function(e) {
        this.setState({domain: e.target.value});
    },

    addDomain: function(e) {
        e.preventDefault();
        VegaDNSActions.addDomain(this.state.domain);
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
                    <button type="submit" onClick={this.addDomain} className="btn btn-primary">Create</button>
                    &nbsp;
                    <button type="submit" onClick={this.props.hideCallback} className="btn btn-danger">Cancel</button>
                </form>
            </section>
        );
    }
});

module.exports = DomainAddForm;
