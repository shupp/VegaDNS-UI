var React = require('react');
var createClass = require('create-react-class');
var VegaDNSActions = require('../actions/VegaDNSActions');
var VegaDNSClient = require('../utils/VegaDNSClient');

var LocationPrefixAddForm = createClass({
    getInitialState: function() {
        return {
            prefix: "",
            prefix_description: "",
            prefix_type: "ipv4"
        }
    },

    propTypes: {
        location: React.PropTypes.object.isRequired,
        listCallback: React.PropTypes.func.isRequired
    },

    handlePrefixChange: function(e) {
        this.setState({
            prefix: e.target.value
        });
    },

    handleDescriptionChange: function(e) {
        this.setState({
            prefix_description: e.target.value
        });
    },

    handleTypeChange: function(e) {
        this.setState({
            prefix_type: e.target.value
        });
    },

    addLocationPrefix: function(e) {
        e.preventDefault();

        VegaDNSClient.addLocationPrefix(
            this.props.location.location_id,
            this.state.prefix,
            this.state.prefix_description,
            this.state.prefix_type
        ).success(data => {
            VegaDNSActions.successNotification(
                "Location prefix \"" + this.state.prefix + "\" added successfully"
            );
            this.props.listCallback();
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Unable to add prefix: ",
                data
            );
        });

        return false;
    },

    render: function() {
        return (
            <section id="add_location">
                <h2>{"Create a new network prefix for location \"" + this.props.location.location + "\""}</h2>
                <div className="col-sm-8">
                    <form>
                        <div className="form-group">
                            <label htmlFor="location_prefix">Prefix</label>
                            <input onChange={this.handlePrefixChange} className="form-control" id="location_prefix" placeholder="192.168.1" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="prefix_description">Prefix Description</label>
                            <input onChange={this.handleDescriptionChange} className="form-control" id="prefix_description" placeholder="Internal network" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="prefix_type">Network Address Type</label>
                            <select type="select" onChange={this.handleTypeChange} className="form-control" id="prefix_type">
                                <option value="ipv4">ipv4</option>
                                <option value="ipv6">ipv6</option>
                            </select>
                        </div>
                        <button type="submit" onClick={this.addLocationPrefix} className="btn btn-primary">Create</button>
                        &nbsp;
                        <button type="submit" onClick={this.props.hideCallback} className="btn btn-danger">Cancel</button>
                    </form>
                </div>
            </section>
        );
    }
});

export default LocationPrefixAddForm;
